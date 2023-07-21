//services.ts

export const jsonAction = async (payload: any) => {
  return await fetch('http://localhost:5000/api/json-file-action', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(json => json);
};
