import React, { useRef } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import FormModal from '../FormModal/FormModal';
dayjs.extend(customParseFormat);

const Modal = (props) => {
  const refModal = useRef(null);
  const { openModal, setOpenModal } = props;
  //закрытие модального окна
  const onModalClose = () => {
    if (refModal.current) {
      refModal.current.classList.add('disapp');
      setTimeout(() => {
        refModal.current.classList.remove('disapp');
        setOpenModal(false);
      }, 500);
    }
  };
  const propsForm = { ...props, onModalClose };

  return openModal ? (
    <div className="modal" ref={refModal}>
      <div className="modal_container">
        <FormModal {...propsForm} />
      </div>
    </div>
  ) : null;
};

export default Modal;
