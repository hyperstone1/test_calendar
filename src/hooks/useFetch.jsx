import { useState, useEffect } from 'react';

const useFetch = (options) => {
  const [data, setData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function getUsers() {
    try {
      const response = await fetch(options.urlUsers, {
        method: options.method || 'GET',
        headers: options.headers || {},
        body: options.body || undefined,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      setUsersData(responseData);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function getEvents() {
    try {
      await fetch(options.urlEvents, {
        method: options.method || 'GET',
        headers: options.headers || {},
        body: JSON.stringify(options.body) || undefined,
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setData(data);
        });
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function appendUsers() {
    try {
      const response = await fetch(options.urlUsers, {
        method: options.method || 'POST',
        headers: options.headers || {},
        body: JSON.stringify(options.body) || undefined,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      setUsersData(responseData);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function appendEvent() {
    try {
      console.log(options.body);
      const response = await fetch(options.urlEvents, {
        method: options.method || 'POST',
        headers: options.headers || {},
        body: JSON.stringify(options.body) || undefined,
      });

      const dataJson = await response.json();
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return dataJson;
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function putEvent() {
    try {
      const response = await fetch(`${options.urlEvents}/${options.curEditEvent}`, {
        method: options.method || 'PUT',
        headers: options.headers || {},
        body: JSON.stringify(options.body) || undefined,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      setData(
        data.map((obj) =>
          obj.id === responseData.id
            ? {
                ...obj,
                idEvent: responseData.idEvent,
                event: responseData.event,
                time: responseData.time,
              }
            : obj,
        ),
      );
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function deleteEvent(id) {
    try {
      const response = await fetch(`${options.urlEvents}/${id}`, {
        method: options.method || 'DELETE',
        headers: options.headers || {},
        // body: JSON.stringify(options.body) || undefined,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return {
    getUsers,
    getEvents,
    appendUsers,
    setData,
    appendEvent,
    putEvent,
    deleteEvent,
    data,
    usersData,
    loading,
    error,
  };
};

export default useFetch;

// import { useState, useEffect } from 'react';

// const useFetch = (url, initialData) => {
//   const [data, setData] = useState(initialData);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);

//   useEffect(() => {
//     setLoading(true);
//     fetch(url)
//       .then((res) => res.json())
//       .then((res) => {
//         console.log(res);
//         if (res.error) {
//           setError(true);
//         } else {
//           setData(res);
//         }
//       })
//       .catch((err) => {
//         setError(true);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   return { data, loading, error };
// };

// export default useFetch;
