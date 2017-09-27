package com.blueocean.tpf.common.component.excel.reader.impl;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;

import org.apache.poi.hssf.eventusermodel.EventWorkbookBuilder.SheetRecordCollectingListener;
import org.apache.poi.hssf.eventusermodel.FormatTrackingHSSFListener;
import org.apache.poi.hssf.eventusermodel.HSSFEventFactory;
import org.apache.poi.hssf.eventusermodel.HSSFListener;
import org.apache.poi.hssf.eventusermodel.HSSFRequest;
import org.apache.poi.hssf.eventusermodel.MissingRecordAwareHSSFListener;
import org.apache.poi.hssf.eventusermodel.dummyrecord.LastCellOfRowDummyRecord;
import org.apache.poi.hssf.eventusermodel.dummyrecord.MissingCellDummyRecord;
import org.apache.poi.hssf.model.HSSFFormulaParser;
import org.apache.poi.hssf.record.BOFRecord;
import org.apache.poi.hssf.record.BlankRecord;
import org.apache.poi.hssf.record.BoolErrRecord;
import org.apache.poi.hssf.record.BoundSheetRecord;
import org.apache.poi.hssf.record.EOFRecord;
import org.apache.poi.hssf.record.FormulaRecord;
import org.apache.poi.hssf.record.LabelRecord;
import org.apache.poi.hssf.record.LabelSSTRecord;
import org.apache.poi.hssf.record.NumberRecord;
import org.apache.poi.hssf.record.Record;
import org.apache.poi.hssf.record.SSTRecord;
import org.apache.poi.hssf.record.StringRecord;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.DateUtil;

import com.blueocean.tpf.common.component.excel.model.CellMapper;
import com.blueocean.tpf.common.component.excel.model.ExcelResult;
import com.blueocean.tpf.common.component.excel.util.ExcelReaderUtil;

/**
 * 抽象Excel2003读取器，通过实现HSSFListener监听器，采用事件驱动模式解析excel2003
 * 中的内容，遇到特定事件才会触发，大大减少了内存的使用。
 * 
 */
@SuppressWarnings(value={"rawtypes","unchecked","unused"})
public class ExcelXlsReader extends AbstractExcelReader implements HSSFListener {
	private POIFSFileSystem fs;
	private int curRow = 0;
	/** Should we output the formula, or the value it has? */
	private boolean outputFormulaValues = true;

	/** For parsing Formulas */
	private SheetRecordCollectingListener workbookBuildingListener;
	// excel2003工作薄
	private HSSFWorkbook stubWorkbook;

	// Records we pick up as we process
	private SSTRecord sstRecord;
	private FormatTrackingHSSFListener formatListener;

	private BoundSheetRecord[] orderedBSRs;
	private ArrayList boundSheetRecords = new ArrayList();

	// For handling formulas with string results
	private int nextColumn;
	private boolean outputNextStringRecord;
//	private String sheetName;

	/**
	 * 遍历excel下所有的sheet
	 * @return 
	 * @throws IOException
	 */
	public ExcelResult process(InputStream inputStream) throws IOException {
		this.fs = new POIFSFileSystem(inputStream);
		MissingRecordAwareHSSFListener listener = new MissingRecordAwareHSSFListener(this);
		formatListener = new FormatTrackingHSSFListener(listener);
		HSSFEventFactory factory = new HSSFEventFactory();
		HSSFRequest request = new HSSFRequest();
		if (outputFormulaValues) {
			request.addListenerForAllRecords(formatListener);
		} else {
			workbookBuildingListener = new SheetRecordCollectingListener(formatListener);
			request.addListenerForAllRecords(workbookBuildingListener);
		}
		factory.processWorkbookEvents(request, fs);
		return result;
	}
	/**
	 * HSSFListener 监听方法，处理 Record
	 */
	@Override
	public void processRecord(Record record) {
		short sid = record.getSid();
		if (sid == BoundSheetRecord.sid) {
			boundSheetRecords.add(record);
		}
		if (sid == BOFRecord.sid) {
			bofRecord(record);
		}
		if (sid == SSTRecord.sid) {
			sstRecord = (SSTRecord) record;
		}
		if (sheetAccess()) {
			processRowRecord(record);
		}
	}
	/**
	 * 处理单元格记录
	 * @param record
	 * @param sid
	 */
	private void processRowRecord(Record record) {
		short sid = record.getSid();
		if (sid == EOFRecord.sid) {
			rowReader.ops(mapper);
		}
		if (record instanceof LastCellOfRowDummyRecord) {
			// 行结束时的操作
			endRow();
		}
		if (isAccess(curRow)) {
			Object value = null;
			if (record instanceof MissingCellDummyRecord) {
				//空值的操作，没有样式
				MissingCellDummyRecord mc = (MissingCellDummyRecord) record;
				curCol = mc.getColumn();
				addCellValue(value);
			}else {
				switch (sid) {
					//没有值但具有样式的行中的列
					case BlankRecord.sid:
						curCol = ((BlankRecord)record).getColumn();
						addCellValue(value);
						break;
					case BoolErrRecord.sid: // 单元格为布尔类型
						BoolErrRecord berec = (BoolErrRecord) record;
						curCol = berec.getColumn();
						value =  berec.getBooleanValue();
						addCellValue(value);
						break;
					case FormulaRecord.sid: // 单元格为公式类型
						FormulaRecord frec = (FormulaRecord) record;
						curCol = frec.getColumn();
						if (outputFormulaValues) {
							outputNextStringRecord = true;
							nextColumn = frec.getColumn();
						} else {
							value = HSSFFormulaParser.toFormulaString(stubWorkbook, frec.getParsedExpression());
							addCellValue(value);
						}
						break;
					case StringRecord.sid:// 单元格中公式的字符串
						if (outputNextStringRecord) {
							StringRecord srec = (StringRecord) record;
							curCol = nextColumn;
							addCellValue(srec.getString());
							outputNextStringRecord = false;
						}
						break;
					case LabelRecord.sid:
						LabelRecord lrec = (LabelRecord) record;
						curCol = lrec.getColumn();
						addCellValue(lrec.getValue());
						break;
					case LabelSSTRecord.sid: // 单元格为字符串类型
						LabelSSTRecord lsrec = (LabelSSTRecord) record;
						curCol = lsrec.getColumn();
						if (sstRecord != null) {
							value = sstRecord.getString(lsrec.getSSTIndex());
						}
						addCellValue(value);
						break;
					case NumberRecord.sid: // 单元格为数字类型
						NumberRecord numrec = (NumberRecord) record;
						curCol = numrec.getColumn();
						value = numrec.getValue();
						boolean dateFormat = DateUtil.isADateFormat(formatListener.getFormatIndex(numrec),
								formatListener.getFormatString(numrec));
						if (dateFormat) {
							value = DateUtil.getJavaDate((double) value);
						}
						addCellValue(value);
						break;
				}
			}
		}
	}
	private void addCellValue(Object value) {
		value = ExcelReaderUtil.mapperValue(value,mapper,curCol);
		rowData.add(curCol, value);
	}
	private void bofRecord(Record record) {
		BOFRecord br = (BOFRecord) record;
		if (br.getType() == BOFRecord.TYPE_WORKSHEET) {
			// 如果有需要，则建立子工作薄
			if (workbookBuildingListener != null && stubWorkbook == null) {
				stubWorkbook = workbookBuildingListener.getStubHSSFWorkbook();
			}
			sheetIndex++;
			if (orderedBSRs == null) {
				orderedBSRs = BoundSheetRecord.orderByBofPosition(boundSheetRecords);
			}
//			sheetName = orderedBSRs[sheetIndex].getSheetname();
		}
	}
	/**
	 * 行结束时的操作
	 */
	private void endRow() {
		// 每行结束时， 调用getRows() 方法
		if (isAccess(curRow)) {
			rowReader.getRows(this,curRow,mapper);
		}
		curRow ++;
		// 清空容器
		rowData.clear();
	}

	@Override
	public ExcelResult read(InputStream inputStream, Integer sheetIndex, Integer startRow, Integer endRow,
			CellMapper mapper) {
		init(sheetIndex, startRow, endRow, mapper);
		try {
			return process(inputStream);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
}
