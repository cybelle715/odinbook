import UserProfilePicture from "../UserProfilePicture";
import { useState } from 'react';
import NavAccountOptions from "./NavAccountOptions";

const NavAccount = ({ user }) => {
  const [displayOptions, setDisplayOptions] = useState(false);
  
  const handleClick = () => {
    setDisplayOptions(!displayOptions);
  }
  
  const handleBlur = (e) => {
    setDisplayOptions(false);
    if (e.relatedTarget) e.relatedTarget.click();
  }
  
  return (
    <div className='nav-account' onClick={handleClick} onBlur={handleBlur}>
      <UserProfilePicture pfp={user.pfp} />
      { displayOptions ? <NavAccountOptions /> : null}
    </div>
  );
}

export default NavAccount;