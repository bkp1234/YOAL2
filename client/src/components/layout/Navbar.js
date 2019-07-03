import React from 'react';
import { Link } from 'react-router-dom';
function Navbar() {
  return (
    <nav className='navbar navbar-expand-lg navbar-light bg-light'>
      <a className='navbar-brand' href='#'>
        Navbar
      </a>
      <button
        class='navbar-toggler'
        type='button'
        data-toggle='collapse'
        data-target='#navbarNavAltMarkup'
        aria-controls='navbarNavAltMarkup'
        aria-expanded='false'
        aria-label='Toggle navigation'
      >
        <span className='navbar-toggler-icon' />
      </button>
      <div className='collapse navbar-collapse' id='navbarNavAltMarkup'>
        <div className='navbar-nav'>
          <a class='nav-item nav-link active' href='#'>
            Home <span class='sr-only'>(current)</span>
          </a>
          <Link to='/register' className='nav-item nav-link'>
            Register
          </Link>
          <Link to='/login' className='nav-item nav-link'>
            Log in
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
