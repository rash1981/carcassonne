import React, { useState, useEffect, useRef } from 'react';
import { Button, Space, Modal, Alert, Typography, Card, Tag } from 'antd';
import { 
  ApiOutlined, 
  SyncOutlined, 
  DisconnectOutlined,
  InfoCircleOutlined,
  QrcodeOutlined,
  CameraOutlined 
} from '@ant-design/icons';
import { QRCodeSVG } from 'qrcode.react';
import { Html5Qrcode } from 'html5-qrcode';
import { bluetoothSync, type SyncStatus, type SyncEvent } from '../utils/bluetooth';
import { syncManager, type SyncState } from '../utils/syncManager';

const { Text, Paragraph } = Typography;

interface BluetoothSyncButtonProps {
  onSyncComplete?: () => void;
}

const BluetoothSyncButton: React.FC<BluetoothSyncButtonProps> = ({ onSyncComplete }) => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(bluetoothSync.getStatus());
  const [syncState, setSyncState] = useState<SyncState>(syncManager.getState());
  const [showModal, setShowModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrMode, setQrMode] = useState<'generate' | 'scan'>('generate');
  const [exportData, setExportData] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerInitialized = useRef(false);

  useEffect(() => {
    // Listen to bluetooth events
    const handleSyncEvent = (event: SyncEvent) => {
      setSyncStatus(bluetoothSync.getStatus());
      
      if (event.type === 'connected') {
        Modal.success({
          title: 'Connected',
          content: `Connected to ${event.deviceName || 'device'}`,
        });
      } else if (event.type === 'disconnected') {
        Modal.info({
          title: 'Disconnected',
          content: 'Bluetooth device disconnected',
        });
      } else if (event.type === 'error') {
        Modal.error({
          title: 'Bluetooth Error',
          content: event.error || 'An error occurred',
        });
      } else if (event.type === 'syncComplete') {
        Modal.success({
          title: 'Sync Complete',
          content: 'Game data synchronized successfully!',
        });
        onSyncComplete?.();
      }
    };

    // Listen to sync state changes
    const handleStateChange = (state: SyncState) => {
      setSyncState(state);
    };

    bluetoothSync.addEventListener(handleSyncEvent);
    syncManager.addStateListener(handleStateChange);

    return () => {
      bluetoothSync.removeEventListener(handleSyncEvent);
      syncManager.removeStateListener(handleStateChange);
      // Clean up QR scanner
      if (html5QrCodeRef.current && isScanning) {
        html5QrCodeRef.current.stop().catch(console.error);
      }
    };
  }, [onSyncComplete, isScanning]);

  const handleConnect = async () => {
    try {
      await bluetoothSync.connect();
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await bluetoothSync.disconnect();
    } catch (error) {
      console.error('Disconnection failed:', error);
    }
  };

  const handleSync = async () => {
    try {
      await syncManager.syncWithDevice();
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  const handleShowQR = (mode: 'generate' | 'scan') => {
    setQrMode(mode);
    if (mode === 'generate') {
      const data = syncManager.exportGameData();
      setExportData(data);
    }
    setShowQRModal(true);
  };

  const startQRScanner = async () => {
    try {
      setIsScanning(true);
      
      // Only create a new scanner if one doesn't exist
      if (!html5QrCodeRef.current) {
        if (scannerInitialized.current) {
          // Prevent race condition - scanner is being initialized
          return;
        }
        scannerInitialized.current = true;
        html5QrCodeRef.current = new Html5Qrcode("qr-reader");
      }

      if (html5QrCodeRef.current) {
        await html5QrCodeRef.current.start(
          { facingMode: "environment" }, // Use back camera
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText) => {
            // Successfully scanned QR code
            handleQRScanSuccess(decodedText);
          },
          () => {
            // Ignore scan errors (they happen continuously while scanning)
          }
        );
      }
    } catch (error) {
      console.error('Failed to start QR scanner:', error);
      scannerInitialized.current = false;
      Modal.error({
        title: 'Camera Error',
        content: 'Unable to access camera. Please ensure camera permissions are granted.',
      });
      setIsScanning(false);
    }
  };

  const stopQRScanner = async () => {
    if (html5QrCodeRef.current && isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        setIsScanning(false);
      } catch (error) {
        console.error('Error stopping scanner:', error);
        setIsScanning(false);
      }
    } else {
      setIsScanning(false);
    }
  };

  const handleQRScanSuccess = async (decodedText: string) => {
    // Stop scanning
    await stopQRScanner();
    
    // Import the data
    const result = syncManager.importGameData(decodedText);
    if (result.success) {
      Modal.success({
        title: 'Import Successful',
        content: `Successfully imported ${result.gamesAdded} games from QR code`,
      });
      setShowQRModal(false);
      onSyncComplete?.();
    } else {
      Modal.error({
        title: 'Import Failed',
        content: result.error || 'Invalid QR code data',
      });
    }
  };

  const handleQRModalClose = async () => {
    await stopQRScanner();
    setShowQRModal(false);
    setExportData('');
  };

  const compatibility = bluetoothSync.getBrowserCompatibility();

  return (
    <>
      <Button
        type="default"
        icon={<SyncOutlined />}
        onClick={() => setShowModal(true)}
        style={{ marginLeft: '10px' }}
      >
        Sync
      </Button>

      {/* Main Sync Modal */}
      <Modal
        title={
          <Space>
            <SyncOutlined />
            <span>Sync Game Data</span>
          </Space>
        }
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        width={600}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {/* Browser Compatibility Info */}
          {!compatibility.isSupported && (
            <Alert
              message={`${compatibility.browser} - Bluetooth Not Supported`}
              description="Don't worry! You can still sync using QR codes below."
              type="info"
              showIcon
              icon={<InfoCircleOutlined />}
            />
          )}

          {/* QR Code Sync (Always Available) */}
          <Card title={<><QrcodeOutlined /> QR Code Sync</>} size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Paragraph type="secondary" style={{ marginBottom: 10 }}>
                Works on all devices and browsers, including iOS Safari and Firefox.
              </Paragraph>
              <Space wrap style={{ width: '100%', justifyContent: 'center' }}>
                <Button
                  type="primary"
                  icon={<QrcodeOutlined />}
                  onClick={() => handleShowQR('generate')}
                  size="large"
                >
                  Show QR Code
                </Button>
                <Button
                  type="primary"
                  icon={<CameraOutlined />}
                  onClick={() => handleShowQR('scan')}
                  size="large"
                >
                  Scan QR Code
                </Button>
              </Space>
            </Space>
          </Card>

          {/* Bluetooth Sync (Only for supported browsers) */}
          {compatibility.isSupported && (
            <Card title={<><ApiOutlined /> Bluetooth Sync</>} size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                {/* Connection Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong>Status:</Text>
                  <Tag color={syncStatus.isConnected ? 'success' : 'default'}>
                    {syncStatus.isConnected ? 'Connected' : 'Disconnected'}
                  </Tag>
                </div>
                {syncStatus.deviceName && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong>Device:</Text>
                    <Text>{syncStatus.deviceName}</Text>
                  </div>
                )}

                {/* Error Display */}
                {syncState.error && (
                  <Alert
                    message={syncState.error}
                    type="error"
                    showIcon
                    closable
                  />
                )}

                {/* Bluetooth Actions */}
                <Space wrap style={{ width: '100%', justifyContent: 'center' }}>
                  {!syncStatus.isConnected ? (
                    <Button
                      type="default"
                      icon={<ApiOutlined />}
                      onClick={handleConnect}
                      size="large"
                    >
                      Connect to Device
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="default"
                        icon={<SyncOutlined />}
                        onClick={handleSync}
                        loading={syncState.isSyncing}
                        size="large"
                      >
                        Sync Data
                      </Button>
                      <Button
                        danger
                        icon={<DisconnectOutlined />}
                        onClick={handleDisconnect}
                        size="large"
                      >
                        Disconnect
                      </Button>
                    </>
                  )}
                </Space>
              </Space>
            </Card>
          )}

          {/* Info Section */}
          <Alert
            message="How to Sync"
            description={
              <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                <li><strong>QR Code (Recommended for iOS):</strong> Generate QR code on one device, scan with another device's camera</li>
                {compatibility.isSupported && (
                  <li><strong>Bluetooth:</strong> Both devices connect, then click "Sync Data" to exchange game history</li>
                )}
                <li>Game data is automatically merged without duplicates</li>
              </ul>
            }
            type="info"
            showIcon
          />
        </Space>
      </Modal>

      {/* QR Code Modal */}
      <Modal
        title={
          qrMode === 'generate' ? (
            <><QrcodeOutlined /> Share via QR Code</>
          ) : (
            <><CameraOutlined /> Scan QR Code</>
          )
        }
        open={showQRModal}
        onCancel={handleQRModalClose}
        footer={
          qrMode === 'generate' ? [
            <Button key="close" onClick={handleQRModalClose}>
              Close
            </Button>
          ] : [
            <Button key="close" onClick={handleQRModalClose}>
              {isScanning ? 'Stop Scanning' : 'Close'}
            </Button>
          ]
        }
        width={500}
      >
        {qrMode === 'generate' ? (
          <Space direction="vertical" style={{ width: '100%', alignItems: 'center' }} size="large">
            <Paragraph style={{ textAlign: 'center' }}>
              Scan this QR code with another device to import your game data.
            </Paragraph>
            {exportData && (
              <div style={{ 
                padding: '20px', 
                backgroundColor: 'white',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <QRCodeSVG 
                  value={exportData} 
                  size={300}
                  level="M"
                  includeMargin={true}
                />
              </div>
            )}
            <Alert
              message="Tip"
              description="For best results, ensure good lighting and hold the scanning device steady."
              type="info"
              showIcon
            />
          </Space>
        ) : (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Paragraph style={{ textAlign: 'center' }}>
              Point your camera at the QR code displayed on another device.
            </Paragraph>
            
            {!isScanning ? (
              <div style={{ textAlign: 'center' }}>
                <Button
                  type="primary"
                  icon={<CameraOutlined />}
                  onClick={startQRScanner}
                  size="large"
                >
                  Start Camera
                </Button>
              </div>
            ) : (
              <>
                <div 
                  id="qr-reader" 
                  style={{ 
                    width: '100%',
                    border: '2px solid #1890ff',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}
                />
                <Alert
                  message="Scanning..."
                  description="Position the QR code within the frame"
                  type="info"
                  showIcon
                />
              </>
            )}
          </Space>
        )}
      </Modal>
    </>
  );
};

export default BluetoothSyncButton;
