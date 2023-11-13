import UserName from "../UserName";
import UserProfilePicture from "../UserProfilePicture";


const NavResults = ({ users }) => {
  return (
    <div className='nav-results'>
      {
        !users || users.length === 0 ? null :
          users.map((user, index) => {
            return (
              <div key={index} className='nav-results-user'>
                <UserProfilePicture id={user.id} pfp={user.pfp} />
                <UserName id={user.id} full_name={user.full_name} />
              </div>
            );
          })
      }
    </div>
  );
}

export default NavResults;