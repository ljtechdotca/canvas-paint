import { useState } from "react";
export interface TopBar {}
export const TopBar = ({}: TopBar) => {
  const [dropdown, setDropDown] = useState("");

  const saveAs = () => {
    window.dispatchEvent(new CustomEvent('save-as'));
  }

  return (
    <div id='top-bar' onMouseLeave={e => setDropDown("")}>
      <header id='top-bar-menu'>
        <div onMouseEnter={e => setDropDown("file")}>
          <button>File</button>
          { 
            dropdown === 'file' ? 
            <div className='dropdown-content'>
              <button onClick={() => alert('check todo file')}>New</button>
              <button onClick={() => saveAs()}>Save as</button>
            </div>
            :
            ""
          }
        </div>

        <div onMouseEnter={e => setDropDown("test")}>
          <button>Test</button>
          { 
            dropdown === "test" ? 
            <div className='dropdown-content'>
              <button>test1</button>
              <button>test2</button>
            </div>
            :
            ""
          }
        </div>
      </header>
      <div>
        <span>file1</span>
      </div>
    </div>
  );
};
