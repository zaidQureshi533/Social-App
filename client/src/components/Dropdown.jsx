import React, {useState, useRef, useEffect} from 'react';

const Dropdown = ({label, children}) => {
	const [show, setShow] = useState(false);
	const dropdownRef = useRef(null);

	const handleClickOutside = (event) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			setShow(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div className='relative inline-block text-left' ref={dropdownRef}>
			<div>
				<button
					onClick={() => setShow(!show)}
					type='button'
					className=''
					id='menu-button'
					aria-expanded={show}
					aria-haspopup='true'
				>
					{label}
				</button>
			</div>
			<div
				className={`absolute right-0 z-10 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg text-gray-500 ${
					show ? 'opacity-1' : 'opacity-0'
				} transition-opacity duration-50 `}
				role='menu'
				aria-orientation='vertical'
				aria-labelledby='menu-button'
				tabIndex='-1'
			>
				<div className='py-1' role='none'>
					{children}
				</div>
			</div>
		</div>
	);
};

export default Dropdown;
