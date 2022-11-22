import React from 'react';
import './App.scss';
import Panel from './Components/Panel/Panel';
import CardList from './Components/CardList/CardList';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { getData } from './Redux/Slices/listSlice';
import { useDispatch } from 'react-redux';
import { query, orderBy } from 'firebase/firestore';

function App() {
	const dispatch = useDispatch();
	const data = collection(db, 'todos');
	const sortedData = query(data, orderBy('title', 'asc'));

	/**
	 * При вызове этой функции запрашиваются все данный из FireBase.
	 * После добавляются с помощью специальных функции из React-Redux, Добавляется в State List
	 * @component
	 * Функция ничего не возвращает и не принимает
	 */

	React.useEffect(() => {
		getDocs(sortedData).then((res) =>
			dispatch(getData(res.docs.map((el) => ({ ...el.data(), id: el.id })))),
		);
	}, []);

	return (
		<div className='App'>
			<div className='container'>
				<div className='header__title'>To Do List! Create your Tasks...</div>
				<div className='panel__form'>
					<Panel />
				</div>
				<div className='cardList'>
					<CardList />
				</div>
			</div>
		</div>
	);
}

export default App;
