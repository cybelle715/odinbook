import '../../styles/Button.css';
import '../../styles/HomePage.css';
import { useState } from "react";
import Options from './Options';
import Posts from './Posts';
import Contacts from './Contacts';
import FindFriends from './FindFriends';
import Friends from './Friends';

const options = {
  recent: 0,
  friends: 1,
  findFriends: 2
}

const HomePage = () => {
  const [ option, setOption ] = useState(options.recent);
  const [ updateContacts, setUpdateContacts ] = useState(false);
  
  const handleOptions = () => {
    switch (option) {
      case options.recent:
        return <Posts />
      case options.friends:
        return <Friends />
      case options.findFriends:
        return <FindFriends updateContacts={setUpdateContacts} />
      default:
        return null;
    }
  }
  
  return (
    <div id="homepage">
      <div className='homepage-left'>
        <Options options={options} setOption={setOption} />
      </div>
      
      <div className="homepage-middle">
        {handleOptions()}
      </div>
      
      <div className="homepage-right">
        <Contacts update={updateContacts} />
      </div>
    </div>
  );
}

export default HomePage;