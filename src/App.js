import React, { Fragment, useState, useEffect } from 'react';
import GifGroup from './components/gif_group.jsx';
import './App.scss';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from 'react-loader-spinner';

function App() {
  const debug = true;
  let [ loading, setLoading ] = useState(true);
  let [ files, setFiles ] = useState([]);

  useEffect(() => {
  
    const fetchData = async () => {
      const result = await fetch('https://dl.dropboxusercontent.com/s/15s8o1zn7erezl4/files.json?raw=1').then(r => r);
      result.json().then(files => {
        setFiles(files)
      }).then(setLoading(false));
    };
 
    fetchData();
  }, []);

  
  return (
    <Fragment>
        {!debug && <div className={'mask'}></div>}
        {!loading && <GifGroup files={files} />}       
        <Loader visible={loading} 
                  type="Puff"
                  color="#00BFFF"
                  
                  timeout={0}>loading 
        </Loader> 
    </Fragment>
  );
}

export default App;
