import {Sequence, Audio, staticFile, useVideoConfig} from 'remotion';
import {ScreenSlide} from './ScreenSlide';
import screens from '../../screens.json';

export const WalkthroughVideo: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <>
      {screens.screens.map((screen, index) => {
        const start = screens.screens.slice(0, index).reduce((acc, s) => acc + s.duration * fps, 0);
        const duration = screen.duration * fps;
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
