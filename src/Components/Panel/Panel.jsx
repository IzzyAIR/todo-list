import React from 'react';
import styles from './Panel.module.scss';

// Импорты из MATERIAL UI
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';

//Импорты Redux
import { useDispatch } from 'react-redux';
import { addItem, getData } from '../../Redux/Slices/listSlice';

//Импорты  FireBase
import { db, storage } from '../../firebase';
import { doc, collection, getDocs, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { query, orderBy } from 'firebase/firestore';

/**
 * Объект по умолчанию для начального рендера и очистки полей input после добавления новой задачки.
 * @object
 */
const default_todo = {
	title: '',
	description: '',
	date: dayjs(),
};

/**
 * React компонент Panel собирает и отправляет данные в FireBase и Redux
 * @returns Возвращает HTML разметку для ввода информации
 */
const Panel = () => {
	const dateFormat = 'DD.MM.YY hh:mm';
	const dispatch = useDispatch();

	const data = collection(db, 'todos');
	const sortedData = query(data, orderBy('title', 'asc'));

	// задаем пустую форму
	const [newTodo, setNewTodo] = React.useState(default_todo);
	const [file, setFile] = React.useState(null);

	/**
	 *Функция слушает Event и работает на изменение каждого Input и сохраняет ввод новых данный в useState
	 * @param {object} event
	 */
	const onChangeValue = (event) => {
		// name or description
		if (event.target) {
			const { name, value } = event.target;
			setNewTodo({ ...newTodo, [name]: value });
		} else {
			setNewTodo({ ...newTodo, date: event });
		}
	};
	const onFileChange = (event) => {
		if (event.target.files.length < 1) {
			console.log(event.target.files.length);
		}

		setFile(event.target.files[0]);
	};

	// добавляет задачку
	/** Функция собирает все необходимые данные и Добавляет задачку в FireBase и Redux.
	 * Константа dataList достаёт из FireBase коллекцию todos .
	 * Константа formattedItem содержит в себе все введённые данные. И отправляет в Redux.
	 * После идёт проверка добаления Файла . Если Файл есть приступает к загрузке файла в хранилице FireStore
	 * Дожидается загрузки и получает URL Файла и добавляет в FireBase и паралельно отправляет в Redux.
	 * Если Файла нет тогда сразу добавляет в FireBase и паралельно отправляет в Redux.
	 * @constructor
	 */
	const addTodo = () => {
		const dataList = doc(collection(db, 'todos'));
		const formattedItem = { ...newTodo, date: newTodo.date.format(dateFormat), done: false };

		dispatch(addItem(formattedItem));
		setNewTodo(default_todo);

		// если файл есть то сначала грузим файл а потом уже заливаем задачку
		if (Boolean(file)) {
			const fileName = (Math.random() + 1).toString(36).substring(7);
			const fileExtregex = /\.[0-9a-z]+$/i;
			const fileExtension = file.name.match(fileExtregex)[0];
			const storageRef = ref(storage, `/files/${fileName}.${fileExtension}`);
			const uploadTask = uploadBytesResumable(storageRef, file);
			uploadTask
				.then(() => {
					return getDownloadURL(uploadTask.snapshot.ref);
				})
				.then((url) => {
					return setDoc(dataList, { ...formattedItem, fileUrl: url });
				})
				.then(() => {
					getDocs(sortedData).then((res) =>
						dispatch(getData(res.docs.map((el) => ({ ...el.data(), id: el.id })))),
					);
				});
		} else {
			// если файла нет то сразу грузим задачку
			setDoc(dataList, formattedItem).then(() => {
				getDocs(sortedData).then((res) =>
					dispatch(getData(res.docs.map((el) => ({ ...el.data(), id: el.id })))),
				);
			});
		}
	};
	/**
	 * Ищет в Event была ли загрузка файла. Если файл был загружен добавляем его в useState file, если нет тогда пропускаем
	 * @param {*} event
	 * @returns Просто пропускаем
	 */

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<div className={styles.container__panel}>
				<div className={styles.form__container}>
					<div className={styles.container__top}>
						<TextField
							className={styles.input__title}
							id='outlined-basic'
							name='title'
							label='Title of Task...'
							variant='outlined'
							value={newTodo.title}
							onChange={onChangeValue}
						/>
						<DateTimePicker
							className={styles.input__date}
							label='Date & Time picker'
							inputFormat={dateFormat}
							value={newTodo.date}
							onChange={onChangeValue}
							renderInput={(params) => <TextField {...params} />}
						/>

						<Button
							className={styles.btn__add}
							variant='contained'
							disabled={!newTodo.title}
							onClick={() => {
								addTodo();
								setNewTodo(default_todo);
							}}
						>
							Add Task!
						</Button>
					</div>
					<TextField
						name='description'
						value={newTodo.description}
						className={styles.input__text}
						id='outlined-multiline-static'
						label='Description...'
						multiline
						rows={5}
						onChange={(e) => onChangeValue(e)}
					/>

					<input className={styles.input__file} type={'file'} onChange={onFileChange} />
				</div>
			</div>
		</LocalizationProvider>
	);
};
export default Panel;
