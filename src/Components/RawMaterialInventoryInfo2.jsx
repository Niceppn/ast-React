// src/components/RawMaterialInventoryInfo.jsx

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const RawMaterialInventoryInfo2 = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // แยกตัวแปรสำหรับแต่ละประเภท - Import
  const [importPalletSteel, setImportPalletSteel] = useState(0);
  const [importPalletWood, setImportPalletWood] = useState(0);
  const [importSpoolPaper, setImportSpoolPaper] = useState(0);
  const [importSpoolPlastic, setImportSpoolPlastic] = useState(0);
  const [importCylinderPaper, setImportCylinderPaper] = useState(0);
  const [importCylinderPlastic, setImportCylinderPlastic] = useState(0);
  const [importPartition, setImportPartition] = useState(0);
  const [importSack, setImportSack] = useState(0);
  const [importBox, setImportBox] = useState(0);

  // แยกตัวแปรสำหรับแต่ละประเภท - Return
  const [returnPalletSteel, setReturnPalletSteel] = useState(0);
  const [returnPalletWood, setReturnPalletWood] = useState(0);
  const [returnSpoolPaper, setReturnSpoolPaper] = useState(0);
  const [returnedSteelPallet , setReturnedSteelPallet] = useState(0);
  const [returnedWoodPallet , setReturnedWoodPallet] = useState(0);
  const [returnedSpoolPaper , setReturnedSpoolPaper] = useState(0);
  const [returnSpoolPlastic, setReturnSpoolPlastic] = useState(0);
  const [returnCylinderPaper, setReturnCylinderPaper] = useState(0);
  const [returnCylinderPlastic, setReturnCylinderPlastic] = useState(0);
  const [returnPartition, setReturnPartition] = useState(0);
  const [returnSack, setReturnSack] = useState(0);
  const [returnBox, setReturnBox] = useState(0);

  // แยกตัวแปรสำหรับแต่ละประเภท - History
  const [historyPalletSteel, setHistoryPalletSteel] = useState(0);
  const [historyPalletWood, setHistoryPalletWood] = useState(0);
  const [historySpoolPaper, setHistorySpoolPaper] = useState(0);
  const [historySpoolPlastic, setHistorySpoolPlastic] = useState(0);
  const [historyCylinderPaper, setHistoryCylinderPaper] = useState(0);
  const [historyCylinderPlastic, setHistoryCylinderPlastic] = useState(0);
  const [historyPartition, setHistoryPartition] = useState(0);
  const [historySack, setHistorySack] = useState(0);
  const [historyBox, setHistoryBox] = useState(0);



  // Format number with commas
  const formatNumber = (num) => {
    return num ? num.toLocaleString('th-TH') : '0';
  };

  const fetchPalletData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/raw-materials');
      
      if (!response.ok) {
        throw new Error(`Error จ้า: ${response.status}`);
      }
      
      const result = await response.json();
      
     if (result.success) {
  // รวมข้อมูลจากทั้งสองตาราง
  const allData = [
    ...(result.data.packageasts || []),
    ...(result.data.htrpackages || [])
  ];

  // คำนวณยอดรวมตามประเภท
  const importData = allData.filter(item => item.package_status === 'packageImport');
  const returnData = allData.filter(item => item.package_status === 'packageReturn');

  //พาเลทเหล็ก
  const importDataSteel = importData
    .filter(item => item.pallet_type === 'steel' && item.pallet !== null && item.pallet !== '')
    .reduce((sum, item) => sum + (parseInt(item.pallet) || 0), 0);
    

  const returnedDataSteel = allData
    .filter(item => item.pallet_steel && item.pallet_steel !== null && item.pallet_steel !== '')
    .reduce((sum, item) => sum + (parseInt(item.pallet_steel) || 0), 0);


  const returnedDataWood = allData
    .filter(item => item.pallet_wood && item.pallet_wood !== null && item.pallet_wood !== '')
    .reduce((sum, item) => sum + (parseInt(item.pallet_wood) || 0), 0);

  const returnedDataSpool = allData
    .filter(item => item.spool_paper && item.spool_paper !== null && item.spool_paper !== '')
    .reduce((sum, item) => sum + (parseInt(item.spool_paper) || 0), 0);

  const importDataSpool = importData
    .filter(item => item.spool_type === 'spool_paper' && item.spool !== null && item.spool !== '')
    .reduce((sum, item) => sum + (parseInt(item.spool) || 0), 0);
  const returnDataSpool = returnData
    .filter(item => item.spool_type === 'spool_paper' && item.spool !== null && item.spool !== '')
    .reduce((sum, item) => sum + (parseInt(item.spool) || 0), 0);

    
  const historyData = allData.filter(item => item.package_status === 'packageHistory');


  //กรวยพลาสติก
  const importDataSpoolPlastic = importData
  .filter(item => item.spool_type === 'spool_plastic' && item.spool !== null && item.spool !== '')
  .reduce((sum, item) => sum + (parseInt(item.spool) || 0), 0);

  const returnDataSpoolPlastic = returnData
  .filter(item => item.spool_type === 'spool_plastic' && item.spool !== null && item.spool !== '')
  .reduce((sum, item) => sum + (parseInt(item.spool) || 0), 0);

  const returnedDataSpoolPlastic = allData
  .filter(item => item.spool_plastic && item.spool_plastic !== null && item.spool_plastic !== '')
  .reduce((sum, item) => sum + (parseInt(item.spool_plastic) || 0), 0);

  //กระบอกกระดาษ
  const importDataSpoolCPaper = importData
  .filter(item => item.spool_type === 'spoolC_paper' && item.spool !== null && item.spool !== '')
  .reduce((sum, item) => sum + (parseInt(item.spool) || 0), 0);

  const returnDataSpoolCPaper = returnData
  .filter(item => item.spool_type === 'spoolC_paper' && item.spool !== null && item.spool !== '')
  .reduce((sum, item) => sum + (parseInt(item.spool) || 0), 0);

  const returnedDataSpoolCPaper = allData
  .filter(item => item.spoolC_paper && item.spoolC_paper !== null && item.spoolC_paper !== '')
  .reduce((sum, item) => sum + (parseInt(item.spoolC_paper) || 0), 0);


  //กระบอกพลาสติก
  const importDataSpoolCPlastic = importData
  .filter(item => item.spool_type === 'spoolC_plastic' && item.spool !== null && item.spool !== '')
  .reduce((sum, item) => sum + (parseInt(item.spool) || 0), 0);

  const returnDataSpoolCPlastic = returnData
  .filter(item => item.spool_type === 'spoolC_plastic' && item.spool !== null && item.spool !== '')
  .reduce((sum, item) => sum + (parseInt(item.spool) || 0), 0);

  const returnedDataSpoolCPlastic = allData
  .filter(item => item.spoolC_plastic && item.spoolC_plastic !== null && item.spoolC_plastic !== '')
  .reduce((sum, item) => sum + (parseInt(item.spoolC_plastic) || 0), 0);

    //กระดาษกั้น (partition)
   const importDataPartition = importData
    .filter(item => item.partition !== null && item.partition !== '' && 
            (result.data.packageasts || []).some(ast => ast.id === item.id))
    .reduce((sum, item) => sum + (parseInt(item.partition) || 0), 0);


  const returnDataPartition = returnData
    .filter(item => item.partition !== null && item.partition !== '' && 
            (result.data.packageasts || []).some(ast => ast.id === item.id))
    .reduce((sum, item) => sum + (parseInt(item.partition) || 0), 0);

  const returnedDataPartition = (result.data.htrpackages || [])
    .filter(item => item.partition !== null && item.partition !== '')
    .reduce((sum, item) => sum + (parseInt(item.partition) || 0), 0);

  //กระสอบ (sack)
  const importDataSack = importData
    .filter(item => item.sack !== null && item.sack !== '' && 
            (result.data.packageasts || []).some(ast => ast.id === item.id))
    .reduce((sum, item) => sum + (parseInt(item.sack) || 0), 0);

  const returnDataSack = returnData
    .filter(item => item.sack !== null && item.sack !== '' && 
            (result.data.packageasts || []).some(ast => ast.id === item.id))
    .reduce((sum, item) => sum + (parseInt(item.sack) || 0), 0);

  const returnedDataSack = (result.data.htrpackages || [])
    .filter(item => item.sack !== null && item.sack !== '')
    .reduce((sum, item) => sum + (parseInt(item.sack) || 0), 0);


  // กล่อง (box)
  const importDataBox = importData
    .filter(item => item.box !== null && item.box !== '' && 
            (result.data.packageasts || []).some(ast => ast.id === item.id))
    .reduce((sum, item) => sum + (parseInt(item.box) || 0), 0);

  const returnDataBox = returnData
    .filter(item => item.box !== null && item.box !== '' && 
            (result.data.packageasts || []).some(ast => ast.id === item.id))
    .reduce((sum, item) => sum + (parseInt(item.box) || 0), 0);

const returnedDataBox = (result.data.htrpackages || [])
    .filter(item => item.box !== null && item.box !== '')
    .reduce((sum, item) => sum + (parseInt(item.box) || 0), 0);


  // ฟังก์ชันสำหรับรวมค่าตามเงื่อนไข
  const sumByCondition = (data, palletType, field = '') => {
    return data
      .filter(item => item.pallet_type === palletType)
      .reduce((sum, item) => sum + (parseInt(item[field]) || 0), 0);
  };



  

  // ฟังก์ชันสำหรับรวมค่าตามเงื่อนไข spool_type
  const sumBySpoolType = (data, spoolType, field = '') => {
    return data
      .filter(item => item.spool_type === spoolType)
      .reduce((sum, item) => sum + (parseInt(item[field]) || 0), 0);
  };

  // คำนวณสำหรับ พาเลทเหล็ก (steel)
  const importSteelPallet = importDataSteel
  const returnSteelPallet = sumByCondition(returnData, 'steel', 'pallet');
  const returnedSteelPallet = returnedDataSteel; 
  const historySteelPallet = sumByCondition(historyData, 'steel', 'pallet');

  // คำนวณสำหรับ พาเลทไม้ (wood)
  const importWoodPallet = sumByCondition(importData, 'wood', 'pallet');
  const returnWoodPallet = sumByCondition(returnData, 'wood', 'pallet');
  const returnedWoodPallet = returnedDataWood;
  const historyWoodPallet = sumByCondition(historyData, 'wood', 'pallet');

  // คำนวณสำหรับ กรวยกระดาษ (paper spool)
  const importSpoolPaper = importDataSpool; // ใช้ค่าที่ sum แล้วจาก spool_type = 'spoolC_paper'
  const returnSpoolPaper = returnDataSpool
  const returnedSpoolPaper = returnedDataSpool; // ใช้ค่าที่ sum แล้วจาก spool
  const historySpoolPaper = sumBySpoolType(historyData, 'paper', 'spool');

  // คำนวณสำหรับ กรวยพลาสติก (plastic spool)
  const importSpoolPlastic = importDataSpoolPlastic
  const returnSpoolPlastic = returnDataSpoolPlastic
  const historySpoolPlastic = returnedDataSpoolPlastic

  // คำนวณสำหรับ กระบอกกระดาษ (paper cylinder)
  const importCylinderPaper = importDataSpoolCPaper
  const returnCylinderPaper = returnDataSpoolCPaper
  const historyCylinderPaper = returnedDataSpoolCPaper

  // คำนวณสำหรับ กระบอกพลาสติก (plastic cylinder)
  const importCylinderPlastic = importDataSpoolCPlastic
  const returnCylinderPlastic = returnDataSpoolCPlastic
  const historyCylinderPlastic = returnedDataSpoolCPlastic

  // คำนวณสำหรับ กระดาษกั้น (partition)
  const importPartition = importDataPartition
  const returnPartition = returnDataPartition
  const historyPartition = returnedDataPartition

  // คำนวณสำหรับ กระสอบ (sack)
  const importSack = importDataSack
  const returnSack = returnDataSack
  const historySack =returnedDataSack

  // คำนวณสำหรับ กล่อง (box)
  const importBox = importDataBox;
  const returnBox = returnDataBox;
  const historyBox = returnedDataBox;

  // คำนวณและ Set ค่า Import
  setImportPalletSteel(importSteelPallet);
  setImportPalletWood(importWoodPallet);
  setImportSpoolPaper(importSpoolPaper);
  setImportSpoolPlastic(importSpoolPlastic);
  setImportCylinderPaper(importCylinderPaper);
  setImportCylinderPlastic(importCylinderPlastic);
  setImportPartition(importPartition);
  setImportSack(importSack);
  setImportBox(importBox);

  // คำนวณและ Set ค่า Return
  setReturnPalletSteel(returnSteelPallet);
  setReturnPalletWood(returnWoodPallet);
  setReturnedSteelPallet(returnedSteelPallet);
  setReturnedWoodPallet(returnedWoodPallet);
  setReturnSpoolPaper(returnSpoolPaper);
  setReturnedSpoolPaper(returnedSpoolPaper);
  setReturnSpoolPlastic(returnSpoolPlastic);
  setReturnCylinderPaper(returnCylinderPaper);
  setReturnCylinderPlastic(returnCylinderPlastic);
  setReturnPartition(returnPartition);
  setReturnSack(returnSack);
  setReturnBox(returnBox);

  // คำนวณและ Set ค่า History
  setHistoryPalletSteel(historySteelPallet);
  setHistoryPalletWood(historyWoodPallet);
  setHistorySpoolPaper(historySpoolPaper);
  setHistorySpoolPlastic(historySpoolPlastic);
  setHistoryCylinderPaper(historyCylinderPaper);
  setHistoryCylinderPlastic(historyCylinderPlastic);
  setHistoryPartition(historyPartition);
  setHistorySack(historySack);
  setHistoryBox(historyBox);

  // Log ค่าการคำนวณ totalRemaining สำหรับ Info2
  console.log('🔍 Info2 - การคำนวณคงเหลือ:');
  console.log('พาเลทเหล็ก:', { return: returnSteelPallet, returned: returnedSteelPallet, remaining: returnSteelPallet - returnedSteelPallet });
  console.log('พาเลทไม้:', { return: returnWoodPallet, returned: returnedWoodPallet, remaining: returnWoodPallet - returnedWoodPallet });
  console.log('กรวยกระดาษ:', { return: returnSpoolPaper, returned: returnedSpoolPaper, remaining: returnSpoolPaper - returnedSpoolPaper });
  console.log('กรวยพลาสติก:', { return: returnSpoolPlastic, history: historySpoolPlastic, remaining: returnSpoolPlastic - historySpoolPlastic });
  console.log('กระบอกกระดาษ:', { return: returnCylinderPaper, history: historyCylinderPaper, remaining: returnCylinderPaper - historyCylinderPaper });
  console.log('กระบอกพลาสติก:', { return: returnCylinderPlastic, history: historyCylinderPlastic, remaining: returnCylinderPlastic - historyCylinderPlastic });
  console.log('กระดาษกั้น:', { return: returnPartition, history: historyPartition, remaining: returnPartition - historyPartition });
  console.log('กระสอบ:', { return: returnSack, history: historySack, remaining: returnSack - historySack });
  console.log('กล่อง:', { return: returnBox, history: historyBox, remaining: returnBox - historyBox });
  
  const totalRemainingInfo2 = (returnSteelPallet - returnedSteelPallet) + 
                               (returnWoodPallet - returnedWoodPallet) + 
                               (returnSpoolPaper - returnedSpoolPaper) + 
                               (returnSpoolPlastic - historySpoolPlastic) + 
                               (returnCylinderPaper - historyCylinderPaper) + 
                               (returnCylinderPlastic - historyCylinderPlastic) + 
                               (returnPartition - historyPartition) + 
                               (returnSack - historySack) + 
                               (returnBox - historyBox);
  
  console.log('📊 Info2 - ผลรวมคงเหลือ:', totalRemainingInfo2);

} else {
        throw new Error(result.message || 'ไม่สามารถดึงข้อมูลได้');
      }
    } catch (err) {
      console.error('Error fetching pallet data:', err);
      setError(err.message);
      
      // ข้อมูลตัวอย่างเมื่อ API ไม่ทำงาน
      
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
          <strong>แจ้งเตือน:</strong> {error} (กำลังแสดงข้อมูลตัวอย่าง)
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
                  ตรวจสอบวัตถุดิบ
                </h5>
              </div>

              {/* Table Content */}
              <div className="table-responsive">
                <table className="table table-hover mb-2" style={{ tableLayout: 'fixed', width: '100%' }}>
                  <thead style={{ backgroundColor: '#f8f9fa' }}>
                    <tr>
                      <th className="text-center py-4 px-3" style={{ 
                        fontWeight: '600', 
                        color: '#495057',
                        borderTop: 'none',
                        fontSize: '1rem',
                        width: '25%'
                        
                      }}>
                        ชนิด
                      </th>
                      
                      <th className="text-center py-4 px-2" style={{ 
                        fontWeight: '600', 
                        color: '#495057',
                        borderTop: 'none',
                        fontSize: '1rem',
                        width: '18%'
                      }}>
                        นำเข้า
                      </th>
                      <th className="text-center py-4 px-2" style={{ 
                        fontWeight: '600', 
                        color: '#495057',
                        borderTop: 'none',
                        fontSize: '1rem',
                        width: '20%'
                      }}>
                        ต้องส่งคืน
                      </th>
                      <th className="text-center py-4 px-2" style={{ 
                        fontWeight: '600', 
                        color: '#495057',
                        borderTop: 'none',
                        fontSize: '1rem',
                        width: '18%'
                      }}>
                        ส่งคืนแล้ว
                      </th>
                      <th className="text-center py-4 px-2" style={{ 
                        fontWeight: '600', 
                        color: '#495057',
                        borderTop: 'none',
                        fontSize: '1rem',
                        width: '19%'
                      }}>
                        คงเหลือ
                      </th>
                    </tr>
                    
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center py-5">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">กำลังโหลด...</span>
                          </div>
                          <p className="mt-2 text-muted">กำลังดึงข้อมูล...</p>
                        </td>
                      </tr>
                    ) : (
                      <>
                        <tr>
                          <td className="py-3 px-3" style={{ fontSize: '0.95rem' }}>พาเลทเหล็ก</td>
            
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-success">{formatNumber(importPalletSteel)}</span>
                          </td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-warning">{formatNumber(returnPalletSteel)}</span>
                          </td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-info">{formatNumber(returnedSteelPallet)}</span>
                          </td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-primary">{formatNumber(returnPalletSteel - returnedSteelPallet)}</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3" style={{ fontSize: '0.95rem' }}>พาเลทไม้</td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-success">{formatNumber(importPalletWood)}</span>
                          </td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-warning">{formatNumber(returnPalletWood)}</span>
                          </td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-info">{formatNumber(returnedWoodPallet)}</span>
                          </td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-primary">{formatNumber(returnPalletWood - returnedWoodPallet)}</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3" style={{ fontSize: '0.95rem' }}>กรวยกระดาษ</td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-success">{formatNumber(importSpoolPaper)}</span>
                          </td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-warning">{formatNumber(returnSpoolPaper)}</span>
                          </td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-info">{formatNumber(returnedSpoolPaper)}</span>
                          </td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-primary">{formatNumber(returnSpoolPaper - returnedSpoolPaper)}</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3" style={{ fontSize: '0.95rem' }}>กรวยพลาสติก</td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-success">{formatNumber(importSpoolPlastic)}</span>
                          </td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-warning">{formatNumber(returnSpoolPlastic)}</span>
                          </td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-info">{formatNumber(historySpoolPlastic)}</span>
                          </td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-primary">{formatNumber(returnSpoolPlastic - historySpoolPlastic)}</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3" style={{ fontSize: '0.95rem' }}>กระบอกกระดาษ</td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-success">{formatNumber(importCylinderPaper)}</span>
                          </td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-warning">{formatNumber(returnCylinderPaper)}</span>
                          </td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-info">{formatNumber(historyCylinderPaper)}</span>
                          </td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-primary">{formatNumber(returnCylinderPaper - historyCylinderPaper)}</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3" style={{ fontSize: '0.95rem' }}>กระบอกพลาสติก</td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-success">{formatNumber(importCylinderPlastic)}</span>
                          </td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-warning">{formatNumber(returnCylinderPlastic)}</span>
                          </td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-info">{formatNumber(historyCylinderPlastic)}</span>
                          </td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-primary">{formatNumber(returnCylinderPlastic - historyCylinderPlastic)}</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3" style={{ fontSize: '0.95rem' }}>กระดาษกั้น</td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-success">{formatNumber(importPartition)}</span>
                          </td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-warning">{formatNumber(returnPartition)}</span>
                          </td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-info">{formatNumber(historyPartition)}</span>
                          </td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-primary">{formatNumber(returnPartition - historyPartition)}</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3" style={{ fontSize: '0.95rem' }}>กระสอบ</td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-success">{formatNumber(importSack)}</span>
                          </td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-warning">{formatNumber(returnSack)}</span>
                          </td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-info">{formatNumber(historySack)}</span>
                          </td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-primary">{formatNumber(returnSack - historySack)}</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3" style={{ fontSize: '0.95rem' }}>กล่อง</td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-success">{formatNumber(importBox)}</span>
                          </td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-warning">{formatNumber(returnBox)}</span>
                          </td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-info">{formatNumber(historyBox)}</span>
                          </td>
                          <td className="text-center py-3 px-2">
                            <span className="fw-bold text-primary">{formatNumber(returnBox - historyBox)}</span>
                          </td>
                        </tr>
                      </>
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
                      แสดงข้อมูลทั้งหมด 9 รายการ
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
                    <button className="btn btn-primary btn-sm" style={{ borderRadius: '8px' }}>
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
              <h6 className="text-muted mb-2">รายการทั้งหมด</h6>
              <h4 className="fw-bold text-primary mb-0">9</h4>
              <small className="text-muted">ชนิดวัตถุดิบ</small>
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
                  importPalletSteel + importPalletWood + importSpoolPaper + 
                  importSpoolPlastic + importCylinderPaper + importCylinderPlastic + 
                  importPartition + importSack + importBox
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
                  returnPalletSteel + returnPalletWood + returnSpoolPaper + 
                  returnSpoolPlastic + returnCylinderPaper + returnCylinderPlastic + 
                  returnPartition + returnSack + returnBox
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
                  (returnPalletSteel - returnedSteelPallet) + 
                  (returnPalletWood - returnedWoodPallet) + 
                  (returnSpoolPaper - returnedSpoolPaper) + 
                  (returnSpoolPlastic - historySpoolPlastic) + 
                  (returnCylinderPaper - historyCylinderPaper) + 
                  (returnCylinderPlastic - historyCylinderPlastic) + 
                  (returnPartition - historyPartition) + 
                  (returnSack - historySack) + 
                  (returnBox - historyBox)
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

export default RawMaterialInventoryInfo2;
