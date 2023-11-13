import '../../styles/Button.css';
import '../../styles/Options.css';

const Options = ({ setOption, options }) => {
  return (
    <div id="options">
      <button className='btn' type='button' onClick={() => setOption(options.recent)}>Recent</button>
      <button className='btn' type='button' onClick={() => setOption(options.friends)}>Friends</button>
      <button className='btn' type='button' onClick={() => setOption(options.findFriends)}>Find Friends</button>
    </div>
  );
}

export default Options;