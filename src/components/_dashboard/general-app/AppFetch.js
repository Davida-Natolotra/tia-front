import React, { useState, useEffect } from 'react';

const AppFetch = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('../../../_apis_/motos.json', {
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(`data: ${data}`);
        return setData(data);
      })
      .catch((err) => console.log(err));
  }, []);
  return <div>AppFetch</div>;
};

export default AppFetch;
