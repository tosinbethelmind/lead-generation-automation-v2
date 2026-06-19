import {Sequence, Audio, staticFile, useVideoConfig} from 'remotion';
import {ScreenSlide} from './ScreenSlide';
import screens from '../../screens.json';

export const WalkthroughVideo: React.FC = () => {
  const {fps} = useVideoConfig();
  let cursor = 0;
  return (
    <>
      {screens.screens.map((screen, index) => {
        const start = cursor;
        const duration = screen.duration * fps;
        cursor += duration;
        return (
          <Sequence from={start} durationInFrames={duration} key={index}>
            <ScreenSlide screen={screen} />
          </Sequence>
        );
      })}
      <Audio src={staticFile('assets/audio/narration.mp3')} />
    </>
  );
};
