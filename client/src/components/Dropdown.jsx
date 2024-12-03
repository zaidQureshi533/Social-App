import React, {useState, useRef, useEffect} from 'react';

const Dropdown = ({label, children}) => {
	const className =
		'flex gap-5 w-full items-center px-4 py-2 hover:bg-gray-100 transition-all duration-150 p';
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
		<div className='relative inline-block' ref={dropdownRef}>
			<button
				onClick={() => setShow(!show)}
				type='button'
				className='relative'
				id='menu-button'
				aria-expanded={show}
				aria-haspopup='true'
			>
				{label}
			</button>
			<div
				className={`absolute right-1 z-10 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-[0_0_15px_0_rgba(0,0,0,0.2)] text-gray-700 transition-transform duration-200 ease-in-out ${
					show ? 'scale-1' : 'scale-0'
				}`}
				role='menu'
				aria-orientation='vertical'
				aria-labelledby='menu-button'
				tabIndex='-1'
			>
				<div className='py-1' role='none'>
					{React.Children.map(children, (child) => {
						if (React.isValidElement(child)) {
							return React.cloneElement(child, {
								className: `${child.props.className || ''} ${className}`,
							});
						}
						return null;
					})}
				</div>
			</div>
		</div>
	);
};

export default Dropdown;
