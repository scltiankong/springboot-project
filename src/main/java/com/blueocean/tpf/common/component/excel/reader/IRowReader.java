package com.blueocean.tpf.common.component.excel.reader;

import com.blueocean.tpf.common.component.excel.model.CellMapper;

public interface IRowReader {
	void getRows(IExcelReader excelReader, int curRow,CellMapper mapper);

	void ops( CellMapper mapper);
}
