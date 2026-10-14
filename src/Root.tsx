import {Composition} from 'remotion';
import {Reel} from './Reel';
import {reelSchema} from './schema';
import {buildTimeline} from './timeline';
import config from '../config/reel.json';

export const Root = () => <Composition
  id="ILT-Reel" component={Reel} width={1080} height={1920} fps={30}
  durationInFrames={540} schema={reelSchema} defaultProps={reelSchema.parse(config)}
  calculateMetadata={({props})=>({durationInFrames:buildTimeline(props,30).totalFrames,props:reelSchema.parse(props)})}
/>;
