import {Img, spring, useCurrentFrame, interpolate} from '@remotion/video';
import {FC} from 'react';

type Screen = {
  imagePath: string;
  title: string;
  cursor?: boolean;
  duration: number;
};

export const ScreenSlide: FC<{screen: Screen}> = ({screen}) => {
  const frame = useCurrentFrame();
  const fps = 30;
  // zoom progress over the whole screen duration
  const progress = spring({frame, fps, config: {damping: 15, stiffness: 120}});
  const scale = interpolate(progress, [0, 1], [1, 1.2]);

  return (
    <div style={{position: 'relative', width: '100%', height: '100%'}}>
      <Img
        src={screen.imagePath}
        style={{transform: `scale(${scale})`, width: '100%', height: '100%'}}
      />
      {screen.cursor && (
        <div
          style={{
            position: 'absolute',
            left: '55%',
            top: '45%',
            width: 32,
            height: 32,
            backgroundImage: "url('/assets/cursor.png')",
            backgroundSize: 'contain',
            animation: 'pulse 1s infinite',
          }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          color: '#fff',
          fontSize: 24,
          textShadow: '0 0 4px rgba(0,0,0,0.7)',
        }}
      >
        {screen.title}
      </div>
    </div>
  );
};
