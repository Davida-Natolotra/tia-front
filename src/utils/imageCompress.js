import Resizer from 'react-image-file-resizer';

export const fileChangedHandler = (event, setState) => {
  let fileInput = false;
  if (event.target.files[0]) {
    fileInput = true;
  }
  if (fileInput) {
    try {
      const img = Resizer.imageFileResizer(
        event.target.files[0],
        720,
        500,
        'JPEG',
        100,
        0,
        (uri) => {
          setState(uri);
          const base64str = uri.split('base64,')[1];
          const decoded = atob(base64str);
          console.log(`compressed = ${decoded.length}`);
        },
        'base64',
        200,
        200
      );
      //   console.log('img: ', typeof img);
    } catch (err) {
      console.log(err);
    }
  }
};
