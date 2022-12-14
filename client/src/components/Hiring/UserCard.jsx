import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Stack, Chip, Avatar, Box } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';

export default function UserCard({ user }) {
	const navigate = useNavigate();
	const { avatar, firstName, lastName, username, availability, skills } = user;
	return (
		<Card sx={{ minWidth: 275, mb: 2 }} raised>
			<CardContent>
				<Stack direction="row" spacing={2} alignItems="center">
					<Avatar
						alt={`${firstName} ${lastName}`}
						src={avatar || null}
						sx={{ width: 56, height: 56 }}
					/>
					<Box>
						<Typography variant="h5" component="div">
							{firstName} {lastName}
						</Typography>
						<Typography color="text.secondary">@{username}</Typography>
					</Box>
				</Stack>
				<Stack direction="row" spacing={1} sx={{ mt: 2, mb: 1 }}>
					<WorkOutlineIcon />
					<Typography>Availabilities</Typography>
				</Stack>
				<Stack spacing={1} direction="row">
					{availability.map((singleAvailability) => (
						<Chip label={singleAvailability} key={singleAvailability} />
					))}
				</Stack>
				<Stack direction="row" spacing={1} sx={{ mt: 2, mb: 1 }}>
					<HandymanOutlinedIcon />
					<Typography>Skills</Typography>
				</Stack>
				<Stack spacing={1} direction="row">
					{skills.map((singleSkill) => (
						<Chip label={singleSkill} key={singleSkill} />
					))}
				</Stack>
			</CardContent>
			<CardActions>
				<Button
					size="small"
					onClick={() => {
						navigate(`/users/${username}`);
					}}
					aria-label="open user"
				>
					User Profile
				</Button>
			</CardActions>
		</Card>
	);
}
