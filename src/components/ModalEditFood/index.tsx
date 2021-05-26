import { useRef } from 'react';
import { FiCheckSquare } from 'react-icons/fi';

import Yup from 'yup';

import { FormHandles } from '@unform/core'

import { Form } from './styles';
import Modal from '../Modal';
import Input from '../Input';
import getValidationErrors from '../../utils/getValidationErrors';

interface ModalEditFoodProps {
  isOpen: boolean;
  setIsOpen: () => void;
  editingFood: boolean;
  handleUpdateFood: (food: FoodInput) => Promise<void>;
}

interface FoodInput {
  image: string;
  name: string;
  price: string,
  description: string;
}

const ModalEditFood: React.FC<ModalEditFoodProps> = ({ isOpen, setIsOpen, editingFood, handleUpdateFood }) => {
  const formRef = useRef<FormHandles>(null)

  const handleSubmit = async (data: FoodInput) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        // ...
      })

      await schema.validate(data, {
        abortEarly: false
      });

      handleUpdateFood(data);
      setIsOpen();
    } catch (err) {
      const errors = getValidationErrors(err);

      formRef.current?.setErrors(errors);
    }
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit} initialData={editingFood}>
        <h1>Editar Prato</h1>
        <Input name="image" placeholder="Cole o link aqui" />

        <Input name="name" placeholder="Ex: Moda Italiana" />
        <Input name="price" placeholder="Ex: 19.90" />

        <Input name="description" placeholder="Descrição" />

        <button type="submit" data-testid="edit-food-button">
          <div className="text">Editar Prato</div>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
};

export default ModalEditFood;
