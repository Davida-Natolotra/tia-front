import Resizer from 'react-image-file-resizer';

export const fileChangedHandler = ({ event, setStateFile, setStateURI, setChange }) => {
  let fileInput = false;
  if (event.target.files[0]) {
    fileInput = true;
  }
  if (fileInput) {
    try {
      Resizer.imageFileResizer(
        event.target.files[0],
        720,
        500,
        'JPEG',
        100,
        0,
        (uri) => {
          setStateFile(uri);
        },
        'file',
        200,
        200
      );
      //   console.log('img: ', typeof img);
    } catch (err) {
      console.log(err);
    }
    try {
      Resizer.imageFileResizer(
        event.target.files[0],
        720,
        500,
        'JPEG',
        100,
        0,
        (uri) => {
          setStateURI(uri);
        },
        'base64',
        200,
        200
      );
      setChange(true);
    } catch (err) {
      console.log(err);
    }
  }
};
