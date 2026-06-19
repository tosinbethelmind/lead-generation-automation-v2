import {Composition} from 'remotion';
import {WalkthroughVideo} from './WalkthroughVideo';
import screens from '../../screens.json';

export const RemotionRoot = () => {
  const fps = 30;
  const totalFrames = screens.screens.reduce((sum, s) => sum + s.duration * fps, 0);
  return (
    <>
      <Composition
        id="Walkthrough"
        component={WalkthroughVideo}
        durationInFrames={totalFrames}
        fps={fps}
        width={1200}
        height={800}
      />
    </>
  );
};
