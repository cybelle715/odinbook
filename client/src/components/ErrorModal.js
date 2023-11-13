import '../styles/ErrorModal.css';

const ErrorModal = ({ errors }) => {
  return (
    <>
      <h4>Errors</h4>
      <ul className='errors'>
        {
          errors.map((err, index) => {
            return (
              <li key={index}>{err}</li>
            );
          })
        }
      </ul>
    </>
  );
}

export default ErrorModal;