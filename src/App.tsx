import { Button } from '@douyinfe/semi-ui';
import { useRef, useState } from 'react';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [isStart, setIsStart] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const displayMediaRef = useRef<MediaStream | null>(null);

  const handleDataAvailable = (event: BlobEvent) => {
    if (event.data && event.data.size > 0) {
      setUrl(URL.createObjectURL(event.data));
    }
  };

  const recordStart = async () => {
    console.log('开始录制');
    let mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder) {
      const displayMedia = await navigator.mediaDevices.getDisplayMedia({ video: true });
      mediaRecorder = new MediaRecorder(displayMedia, {
        videoBitsPerSecond: 6000000,
        mimeType: 'video/webm;codecs=h264',
      });
      displayMediaRef.current = displayMedia;
      mediaRecorderRef.current = mediaRecorder;
    }

    if (isStart) {
      mediaRecorder.stop();
      mediaRecorder.removeEventListener('dataavailable', handleDataAvailable);
      setIsStart(false);
      displayMediaRef.current?.getTracks().forEach(track => track.stop());
      return;
    }
    mediaRecorder.addEventListener('dataavailable', handleDataAvailable);
    mediaRecorder.start();
    setIsStart(true);
  };

  return (
    <div className='App'>
      <div>
        <Button onClick={recordStart} theme='solid' type='primary'>
          {isStart ? '结束录制' : '点击开始录制'}
        </Button>
        {url && (
          <Button
            onClick={() => {
              const a = document.createElement('a');
              a.href = url;
              a.download = `${Date.now()}.webm`;
              a.click();
            }}
            style={{ marginLeft: 10 }}
            theme='solid'
            type='secondary'
          >
            下载视频
          </Button>
        )}
      </div>
      {url && <video src={url} controls />}
    </div>
  );
}

export default App;
