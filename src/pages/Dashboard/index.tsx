import { Component, useState, useEffect } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface FoodInput {
  id: number,
  image: string;
  name: string;
  price: string,
  description: string;
}

const Dashboard = () => {
  const [foods, setFoods] = useState<FoodInput[]>([]);
  const [editingFood, setEditingFood] = useState<FoodInput>({} as FoodInput);
  const [modalOpen, setModalOpen] = useState<Boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<Boolean>(false);

  useEffect(() => {
    api.get('/foods').then(response => setFoods(response.data));
  }, []);

  const handleAddFood = async (food: FoodInput) => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods(oldMenu => [...oldMenu, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: FoodInput) => {
    const newFood = { ...editingFood, ...food };

    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        newFood
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: Number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  const toggleModal = () => {
    setModalOpen(!modalOpen)
  }

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  }

  const handleEditFood = (food: FoodInput) => {
    setEditingFood(food);
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
