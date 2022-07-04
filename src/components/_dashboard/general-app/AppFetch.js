import React, { useState, useEffect } from 'react';

const AppFetch = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('http://localhost:8000/api/')
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        return setData(data);
      })
      .catch((err) => console.log(err));
  }, []);
  return <div>AppFetch</div>;
};

export default AppFetch;
