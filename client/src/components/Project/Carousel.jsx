import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { Button, MobileStepper } from '@mui/material';
import React, { useState } from 'react';

function Carousel({ projectMedia }) {
	const [activeStep, setActiveStep] = useState(0);
	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};
	return (
		<div>
			<img
				style={{
					borderRadius: 15,
					height: 280,
					width: '100%',
					maxWidth: 550,
				}}
				src={projectMedia[activeStep]}
				alt={projectMedia[activeStep]}
			/>
			<MobileStepper
				index={activeStep}
				steps={projectMedia.length}
				position="static"
				activeStep={activeStep}
				nextButton={
					<Button
						size="small"
						type="button"
						onClick={handleNext}
						disabled={activeStep === projectMedia.length - 1}
					>
						Next
						<KeyboardArrowRight />
					</Button>
				}
				backButton={
					<Button
						size="small"
						type="button"
						onClick={handleBack}
						disabled={activeStep === 0}
					>
						<KeyboardArrowLeft />
						Back
					</Button>
				}
			/>
		</div>
	);
}

export default Carousel;
