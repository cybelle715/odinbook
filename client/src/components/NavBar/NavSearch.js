import { useState, useEffect } from 'react';
import { searchUsers } from '../../apis/userAPI';
import '../../styles/NavBar.css';
import NavResults from './NavResults';

const NavSearch = () => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [displayResults, setDisplayResults] = useState(true);
  
  useEffect(() => {
    searchUsers(search)
      .then(res => {
        setUsers(res.data);
      })
  }, [search]);
  
  const handleChange = (e) => {
    setSearch(e.target.value.toLowerCase());
  }
  
  const handleBlur = (e) => {
    setDisplayResults(false);
    if (e.currentTarget.parentNode.contains(e.relatedTarget))  e.relatedTarget.click();
  }
  
  const handleFocus = (e) => {
    setDisplayResults(true);
  }
  
  return (
    <div className='nav-search'>
      <input type='text' className='nav-search-input' name='search' onBlur={handleBlur} onFocus={handleFocus} defaultValue={search} onChange={handleChange} />
      { users?.length > 0 && displayResults ? <NavResults users={users} /> : null }
    </div>
  );
}

export default NavSearch;