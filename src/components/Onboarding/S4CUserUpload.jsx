//bulk user account creation component
import React, { useEffect, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import onboardingPic from '../../assets/onboardingPic.png';

function S4CUserUpload(props) {
	const onDrop = useCallback(acceptedFiles => {
		acceptedFiles.forEach(file => {
			const reader = new FileReader();

			reader.onabort = () => console.log('file reading was aborted');
			reader.onerror = () => console.log('file reading has failed');
			reader.onload = () => {
				// Can use this to use file contents
				const binaryStr = reader.result;
				console.log(binaryStr);
			};
			reader.readAsArrayBuffer(file);
		});
	}, []);

	const [files, setFiles] = useState([]);
	const { getRootProps, getInputProps } = useDropzone({
		// accept: 'text/*',
		onDrop: acceptedFiles => {
			setFiles(
				acceptedFiles.map(file =>
					Object.assign(file, {
						preview: URL.createObjectURL(file),
					}),
				),
			);
		},
	});

	const thumbs = files.map(file => (
		<div key={file.name}>
			<div>
				<img src={file.preview} />
			</div>
		</div>
	));

	useEffect(
		() => () => {
			files.forEach(file => URL.revokeObjectURL(file.preview));
		},
		[files],
	);

	return (
		<div>
			<div className="s1-parent-container">
				<div className="s1-img">
					<img src={onboardingPic} />
				</div>
				<div className="bulk-upload-container">
					<h1 className="bulk-upload-title">
						Upload your spreadsheet.
					</h1>
					<div {...getRootProps({ className: 'dropzone' })}>
						<input {...getInputProps()} />
						<i class="fas fa-cloud-upload-alt fa-3x"></i>
						<p>Drag and drop file or browse</p>
					</div>
					<div className="file-preview">{thumbs}</div>
				</div>
			</div>
		</div>
	);
}
export default S4CUserUpload;