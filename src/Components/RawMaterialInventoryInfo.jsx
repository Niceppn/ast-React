import React, { useState, useEffect } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const RawMaterialInventoryInfo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rawMaterialData, setRawMaterialData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  // Format number with commas
  const formatNumber = (num) => {
    return num ? num.toLocaleString('th-TH') : '0';
  };

  // Export to Excel function
  const exportToExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('ตรวจสอบวัตถุดิบ');

      // Set worksheet properties
      worksheet.properties.defaultRowHeight = 20;
      
      // Add title
      worksheet.mergeCells('A1:H2');
      const titleCell = worksheet.getCell('A1');
      titleCell.value = 'รายงานตรวจสอบวัตถุดิบ น้ำหนักสุทธิ';
      titleCell.font = { size: 16, bold: true, color: { argb: '2F5496' } };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      titleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'E7F3FF' }
      };

      // Add date
      worksheet.mergeCells('A3:H3');
      const dateCell = worksheet.getCell('A3');
      dateCell.value = `วันที่สร้างรายงาน: ${new Date().toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`;
      dateCell.font = { size: 12, italic: true };
      dateCell.alignment = { horizontal: 'center' };

      // Add headers
      const headerRow1 = worksheet.getRow(5);
      headerRow1.values = [
        'ชนิดด้าย',
        'จำนวนด้าย(ลูก)',
        'นำเข้า',
        '',
        'นำออก', 
        '',
        'คงเหลือ',
        ''
      ];

      const headerRow2 = worksheet.getRow(6);
      headerRow2.values = [
        '',
        '',
        'ปอนด์',
        'กิโลกรัม',
        'ปอนด์',
        'กิโลกรัม',
        'ปอนด์',
        'กิโลกรัม'
      ];

      // Merge header cells
      worksheet.mergeCells('A5:A6'); // ชนิดด้าย
      worksheet.mergeCells('B5:B6'); // จำนวนด้าย
      worksheet.mergeCells('C5:D5'); // นำเข้า
      worksheet.mergeCells('E5:F5'); // นำออก
      worksheet.mergeCells('G5:H5'); // คงเหลือ

      // Style headers
      const headerCells = ['A5', 'B5', 'C5', 'E5', 'G5'];
      headerCells.forEach(cellAddr => {
        const cell = worksheet.getCell(cellAddr);
        cell.font = { bold: true, color: { argb: 'FFFFFF' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '4472C4' }
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      // Style sub headers
      const subHeaderCells = ['C6', 'D6', 'E6', 'F6', 'G6', 'H6'];
      subHeaderCells.forEach(cellAddr => {
        const cell = worksheet.getCell(cellAddr);
        cell.font = { bold: true, color: { argb: 'FFFFFF' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '70AD47' }
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      // Add data rows
      rawMaterialData.forEach((item, index) => {
        const rowNum = 7 + index;
        const row = worksheet.getRow(rowNum);
        
        row.values = [
          item.yarnType || 'N/A',
          item.importTotalSpool || 0,
          parseFloat(item.importTotalWeightPNet || 0).toFixed(2),
          parseFloat(item.importTotalWeightKgNet || 0).toFixed(2),
          parseFloat(item.exportTotalWeightPNet || 0).toFixed(2),
          parseFloat(item.exportTotalWeightKgNet || 0).toFixed(2),
          parseFloat(item.remainingWeightPNet || 0).toFixed(2),
          parseFloat(item.remainingWeightKgNet || 0).toFixed(2)
        ];

        // Style data rows
        row.eachCell((cell, colNumber) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
          
          if (colNumber === 1) {
            cell.alignment = { horizontal: 'left', vertical: 'middle' };
          } else {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
          }

          // Alternate row colors
          if (index % 2 === 0) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'F8F9FA' }
            };
          }
        });
      });

      // Add summary row
      const summaryRowNum = 7 + rawMaterialData.length;
      const summaryRow = worksheet.getRow(summaryRowNum + 1);
      summaryRow.values = [
        'รวมทั้งหมด',
        rawMaterialData.reduce((sum, item) => sum + (item.importTotalSpool || 0), 0),
        rawMaterialData.reduce((sum, item) => sum + parseFloat(item.importTotalWeightPNet || 0), 0).toFixed(2),
        rawMaterialData.reduce((sum, item) => sum + parseFloat(item.importTotalWeightKgNet || 0), 0).toFixed(2),
        rawMaterialData.reduce((sum, item) => sum + parseFloat(item.exportTotalWeightPNet || 0), 0).toFixed(2),
        rawMaterialData.reduce((sum, item) => sum + parseFloat(item.exportTotalWeightKgNet || 0), 0).toFixed(2),
        rawMaterialData.reduce((sum, item) => sum + parseFloat(item.remainingWeightPNet || 0), 0).toFixed(2),
        rawMaterialData.reduce((sum, item) => sum + parseFloat(item.remainingWeightKgNet || 0), 0).toFixed(2)
      ];

      // Style summary row
      summaryRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE699' }
        };
        cell.border = {
          top: { style: 'thick' },
          left: { style: 'thin' },
          bottom: { style: 'thick' },
          right: { style: 'thin' }
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });

      // Set column widths
      worksheet.columns = [
        { width: 25 }, // ชนิดด้าย
        { width: 15 }, // จำนวนด้าย
        { width: 15 }, // นำเข้า ปอนด์
        { width: 15 }, // นำเข้า กิโลกรัม
        { width: 15 }, // นำออก ปอนด์
        { width: 15 }, // นำออก กิโลกรัม
        { width: 15 }, // คงเหลือ ปอนด์
        { width: 15 }  // คงเหลือ กิโลกรัม
      ];

      // Generate Excel file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      const fileName = `รายงานตรวจสอบวัตถุดิบ_${new Date().toLocaleDateString('th-TH').replace(/\//g, '-')}.xlsx`;
      saveAs(blob, fileName);

    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('เกิดข้อผิดพลาดในการส่งออกข้อมูล');
    }
  };

  const fetchPalletData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/raw-materials/stockMaterial');
      
      if (!response.ok) {
        throw new Error(`Error จ้า: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        // เก็บข้อมูลดิบจาก API
        const materialsData = result.data.materials || result.data || [];
        const materialstoresData = result.data.materialstores || [];
        
        // จัดกลุ่มข้อมูลตาม yarnType และรวมค่าน้ำหนัก สำหรับ materials (นำเข้า)
        const groupedMaterials = materialsData
          .filter(item => {
            const yarnType = item.yarnType;
            return yarnType && 
                   typeof yarnType === 'string' &&
                   yarnType.trim() !== '' && 
                   yarnType !== 'null' &&
                   !yarnType.startsWith('{') && // กรอง JSON objects
                   !yarnType.includes('null'); // กรองข้อมูลที่มี null
          })
          .reduce((acc, item) => {
          const yarnType = item.yarnType || 'N/A';
          
          if (!acc[yarnType]) {
            acc[yarnType] = {
              yarnType: yarnType,
              totalSpool: 0,
              totalWeightPNet: 0,
              totalWeightKgNet: 0,
              count: 0
            };
          }
          
          acc[yarnType].totalSpool += parseInt(item.spool || 0);
          acc[yarnType].totalWeightPNet += parseFloat(item.weight_p_net || 0);
          acc[yarnType].totalWeightKgNet += parseFloat(item.weight_kg_net || 0);
          acc[yarnType].count += 1;
          
          return acc;
        }, {});

        // จัดกลุ่มข้อมูลตาม yarnType สำหรับ materialstores (นำออก)
        const groupedMaterialstores = materialstoresData
          .filter(item => {
            const yarnType = item.yarnType;
            return yarnType && 
                   typeof yarnType === 'string' &&
                   yarnType.trim() !== '' && 
                   yarnType !== 'null' &&
                   !yarnType.startsWith('{') && // กรอง JSON objects
                   !yarnType.includes('null'); // กรองข้อมูลที่มี null
          })
          .reduce((acc, item) => {
          const yarnType = item.yarnType || 'N/A';
          
          if (!acc[yarnType]) {
            acc[yarnType] = {
              yarnType: yarnType,
              totalSpool: 0,
              totalWeightPNet: 0,
              totalWeightKgNet: 0,
              count: 0
            };
          }
          
          acc[yarnType].totalSpool += parseInt(item.spool || 0);
          acc[yarnType].totalWeightPNet += parseFloat(item.weight_p_net || 0);
          acc[yarnType].totalWeightKgNet += parseFloat(item.weight_kg_net || 0);
          acc[yarnType].count += 1;
          
          return acc;
        }, {});

        // รวมข้อมูลจากทั้งสองตาราง (กรอง null และค่าว่าง)
        const allYarnTypes = new Set([
          ...Object.keys(groupedMaterials),
          ...Object.keys(groupedMaterialstores)
        ].filter(yarnType => 
          yarnType && 
          typeof yarnType === 'string' &&
          yarnType !== 'null' && 
          yarnType !== 'undefined' && 
          yarnType !== 'N/A' && 
          yarnType.trim() !== '' &&
          !yarnType.startsWith('{') && // กรอง JSON objects เช่น {"1":null}
          !yarnType.includes('null') // กรองข้อมูลที่มี null
        ));

        const combinedData = Array.from(allYarnTypes).map(yarnType => {
          const materialsInfo = groupedMaterials[yarnType] || {
            totalSpool: 0,
            totalWeightPNet: 0,
            totalWeightKgNet: 0
          };
          const materialstoresInfo = groupedMaterialstores[yarnType] || {
            totalSpool: 0,
            totalWeightPNet: 0,
            totalWeightKgNet: 0
          };

          return {
            yarnType: yarnType,
            // ข้อมูลนำเข้า (จาก materials)
            importTotalSpool: materialsInfo.totalSpool,
            importTotalWeightPNet: materialsInfo.totalWeightPNet,
            importTotalWeightKgNet: materialsInfo.totalWeightKgNet,
            // ข้อมูลนำออก (จาก materialstores)
            exportTotalSpool: materialstoresInfo.totalSpool,
            exportTotalWeightPNet: materialstoresInfo.totalWeightPNet,
            exportTotalWeightKgNet: materialstoresInfo.totalWeightKgNet,
            // ข้อมูลคงเหลือ
            remainingSpool: materialsInfo.totalSpool - materialstoresInfo.totalSpool,
            remainingWeightPNet: materialsInfo.totalWeightPNet - materialstoresInfo.totalWeightPNet,
            remainingWeightKgNet: materialsInfo.totalWeightKgNet - materialstoresInfo.totalWeightKgNet
          };
        }).sort((a, b) => a.yarnType.localeCompare(b.yarnType));
        
        // อัปเดต rawMaterialData เป็นข้อมูลที่จัดกลุ่มแล้ว
        setRawMaterialData(combinedData);
        setTotalRecords(combinedData.length);

      } else {
        throw new Error(result.message || 'ไม่สามารถดึงข้อมูลได้');
      }
    } catch (err) {
      console.error('Error fetching raw material data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // เรียกใช้เมื่อ component โหลด
  useEffect(() => {
    fetchPalletData();
  }, []);

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="fw-bold text-dark mb-0">
            <i className="bi bi-layers me-3 text-primary"></i>
            ตรวจสอบวัตถุดิบ
          </h2>
          <p className="text-muted mt-2">ข้อมูลรายละเอียดวัตถุดิบในระบบ</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-warning alert-dismissible fade show mb-4" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          <strong>แจ้งเตือน:</strong> {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      {/* Main Table Card */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm border-0" style={{ borderRadius: '12px' }}>
            <div className="card-body p-0">
              {/* Table Header */}
              <div className="p-4 border-bottom" style={{ backgroundColor: '#ffffff' }}>
                <h5 className="card-title fw-bold text-dark mb-0 d-flex align-items-center">
                  <i className="bi bi-graph-up me-2 text-primary"></i>
                  ตรวจสอบวัตถุดิบ น้ำหนักสุทธิ
                </h5>
              </div>

              {/* Table Content */}
              <div className="table-responsive">
                <table className="table table-hover mb-2" style={{ tableLayout: 'fixed', width: '100%' }}>
                  <thead style={{ backgroundColor: '#e8f4f8' }}>
                    <tr>
                      <th rowSpan="2" className="text-center align-middle py-3 px-2" style={{ 
                        fontWeight: '600', 
                        color: '#495057',
                        borderTop: 'none',
                        fontSize: '0.9rem',
                        width: '15%',
                        borderRight: '1px solid #dee2e6'
                      }}>
                        ชนิดด้าย
                      </th>
                      <th rowSpan="2" className="text-center align-middle py-3 px-2" style={{ 
                        fontWeight: '600', 
                        color: '#495057',
                        borderTop: 'none',
                        fontSize: '0.9rem',
                        width: '12%',
                        borderRight: '1px solid #dee2e6'
                      }}>
                        จำนวน<br />ด้าย(ลูก)
                      </th>
                      <th colSpan="2" className="text-center py-2 px-2" style={{ 
                        fontWeight: '600', 
                        color: '#495057',
                        borderTop: 'none',
                        fontSize: '0.9rem',
                        borderBottom: '1px solid #dee2e6',
                        borderRight: '1px solid #dee2e6'
                      }}>
                        นำเข้า
                      </th>
                      <th colSpan="2" className="text-center py-2 px-2" style={{ 
                        fontWeight: '600', 
                        color: '#495057',
                        borderTop: 'none',
                        fontSize: '0.9rem',
                        borderBottom: '1px solid #dee2e6',
                        borderRight: '1px solid #dee2e6'
                      }}>
                        นำออก
                      </th>
                      <th colSpan="2" className="text-center py-2 px-2" style={{ 
                        fontWeight: '600', 
                        color: '#495057',
                        borderTop: 'none',
                        fontSize: '0.9rem',
                        borderBottom: '1px solid #dee2e6'
                      }}>
                        คงเหลือ
                      </th>
                    </tr>
                    <tr>
                      <th className="text-center py-2 px-1" style={{ 
                        fontWeight: '500', 
                        color: '#495057',
                        fontSize: '0.8rem',
                        width: '12%',
                        borderRight: '1px solid #dee2e6'
                      }}>
                        ปอนด์
                      </th>
                      <th className="text-center py-2 px-1" style={{ 
                        fontWeight: '500', 
                        color: '#495057',
                        fontSize: '0.8rem',
                        width: '12%',
                        borderRight: '1px solid #dee2e6'
                      }}>
                        กิโลกรัม
                      </th>
                      <th className="text-center py-2 px-1" style={{ 
                        fontWeight: '500', 
                        color: '#495057',
                        fontSize: '0.8rem',
                        width: '12%',
                        borderRight: '1px solid #dee2e6'
                      }}>
                        ปอนด์
                      </th>
                      <th className="text-center py-2 px-1" style={{ 
                        fontWeight: '500', 
                        color: '#495057',
                        fontSize: '0.8rem',
                        width: '12%',
                        borderRight: '1px solid #dee2e6'
                      }}>
                        กิโลกรัม
                      </th>
                      <th className="text-center py-2 px-1" style={{ 
                        fontWeight: '500', 
                        color: '#495057',
                        fontSize: '0.8rem',
                        width: '12%',
                        borderRight: '1px solid #dee2e6'
                      }}>
                        ปอนด์
                      </th>
                      <th className="text-center py-2 px-1" style={{ 
                        fontWeight: '500', 
                        color: '#495057',
                        fontSize: '0.8rem',
                        width: '12%'
                      }}>
                        กิโลกรัม
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="8" className="text-center py-5">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">กำลังโหลด...</span>
                          </div>
                          <p className="mt-2 text-muted">กำลังดึงข้อมูล...</p>
                        </td>
                      </tr>
                    ) : (
                      rawMaterialData.length > 0 ? (
                        rawMaterialData.map((item, index) => (
                          <tr key={item.yarnType || index}>
                            <td className="py-2 px-2" style={{ fontSize: '0.85rem', borderRight: '1px solid #dee2e6' }}>
                              {item.yarnType || 'N/A'}
                            </td>
                            {/* จำนวนลูก */}
                            <td className="text-center py-2 px-1" style={{ fontSize: '0.85rem', borderRight: '1px solid #dee2e6' }}>
                              <span className="fw-bold text-dark">{formatNumber(item.importTotalSpool || 0)}</span>
                            </td>
                            {/* นำเข้า */}
                            <td className="text-center py-2 px-1" style={{ fontSize: '0.85rem', borderRight: '1px solid #dee2e6' }}>
                              <span className="fw-bold text-success">{formatNumber(parseFloat(item.importTotalWeightPNet || 0).toFixed(2))}</span>
                            </td>
                            <td className="text-center py-2 px-1" style={{ fontSize: '0.85rem', borderRight: '1px solid #dee2e6' }}>
                              <span className="fw-bold text-success">{formatNumber(parseFloat(item.importTotalWeightKgNet || 0).toFixed(2))}</span>
                            </td>
                            {/* นำออก */}
                            <td className="text-center py-2 px-1" style={{ fontSize: '0.85rem', borderRight: '1px solid #dee2e6' }}>
                              <span className="fw-bold text-warning">{formatNumber(parseFloat(item.exportTotalWeightPNet || 0).toFixed(2))}</span>
                            </td>
                            <td className="text-center py-2 px-1" style={{ fontSize: '0.85rem', borderRight: '1px solid #dee2e6' }}>
                              <span className="fw-bold text-warning">{formatNumber(parseFloat(item.exportTotalWeightKgNet || 0).toFixed(2))}</span>
                            </td>
                            {/* คงเหลือ */}
                            <td className="text-center py-2 px-1" style={{ fontSize: '0.85rem', borderRight: '1px solid #dee2e6' }}>
                              <span className="fw-bold text-primary">{formatNumber(parseFloat(item.remainingWeightPNet || 0).toFixed(2))}</span>
                            </td>
                            <td className="text-center py-2 px-1" style={{ fontSize: '0.85rem' }}>
                              <span className="fw-bold text-primary">{formatNumber(parseFloat(item.remainingWeightKgNet || 0).toFixed(2))}</span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center py-5">
                            <div className="text-muted">
                              <i className="bi bi-inbox me-2"></i>
                              ไม่พบข้อมูลในระบบ
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="p-4 border-top" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <small className="text-muted">
                      <i className="bi bi-info-circle me-1"></i>
                      แสดงข้อมูลทั้งหมด {totalRecords.toLocaleString('th-TH')} ชนิดด้าย (จัดกลุ่มแล้ว)
                    </small>
                  </div>
                  <div className="col-md-6 text-end">
                    <button 
                      className="btn btn-outline-primary btn-sm me-2" 
                      style={{ borderRadius: '8px' }}
                      onClick={fetchPalletData}
                      disabled={loading}
                    >
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      รีเฟรช
                    </button>
                    <button 
                      className="btn btn-primary btn-sm" 
                      style={{ borderRadius: '8px' }}
                      onClick={exportToExcel}
                      disabled={loading || rawMaterialData.length === 0}
                    >
                      <i className="bi bi-download me-1"></i>
                      ส่งออกข้อมูล
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mt-4">
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '10px' }}>
            <div className="card-body text-center p-4">
              <div className="mb-3">
                <i className="bi bi-boxes text-primary" style={{ fontSize: '2rem' }}></i>
              </div>
              <h6 className="text-muted mb-2">ชนิดด้ายทั้งหมด</h6>
              <h4 className="fw-bold text-primary mb-0">{totalRecords.toLocaleString('th-TH')}</h4>
              <small className="text-muted">ชนิดด้าย (จัดกลุ่มแล้ว)</small>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '10px' }}>
            <div className="card-body text-center p-4">
              <div className="mb-3">
                <i className="bi bi-arrow-down-circle text-success" style={{ fontSize: '2rem' }}></i>
              </div>
              <h6 className="text-muted mb-2">นำเข้าทั้งหมด</h6>
              <h4 className="fw-bold text-success mb-0">
                {formatNumber(
                  rawMaterialData.reduce((sum, item) => sum + (item.importTotalSpool || 0), 0)
                )}
              </h4>
              <small className="text-muted">ลูก</small>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '10px' }}>
            <div className="card-body text-center p-4">
              <div className="mb-3">
                <i className="bi bi-arrow-up-circle text-warning" style={{ fontSize: '2rem' }}></i>
              </div>
              <h6 className="text-muted mb-2">ส่งออกทั้งหมด</h6>
              <h4 className="fw-bold text-warning mb-0">
                {formatNumber(
                  rawMaterialData.reduce((sum, item) => sum + (item.exportTotalSpool || 0), 0)
                )}
              </h4>
              <small className="text-muted">ลูก</small>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '10px' }}>
            <div className="card-body text-center p-4">
              <div className="mb-3">
                <i className="bi bi-check-circle text-info" style={{ fontSize: '2rem' }}></i>
              </div>
              <h6 className="text-muted mb-2">คงเหลือทั้งหมด</h6>
              <h4 className="fw-bold text-info mb-0">
                {formatNumber(
                  rawMaterialData.reduce((sum, item) => sum + (item.remainingSpool || 0), 0)
                )}
              </h4>
              <small className="text-muted">ลูก</small>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-row:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .table th {
          border-bottom: 2px solid #dee2e6;
        }
        
        .table td {
          border-bottom: 1px solid #dee2e6;
        }
      `}</style>
    </div>
  );
};

export default RawMaterialInventoryInfo;
