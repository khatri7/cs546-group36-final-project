import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Stack, Chip } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate, Link } from 'react-router-dom';

export default function UserCard({ user }) {
	const navigate = useNavigate();
	const { firstName, lastName, username, availability, skills } = user;
	return (
		<Card sx={{ minWidth: 275 }}>
			<CardContent>
				<Typography variant="h5" component="div">
					{firstName} {lastName}
				</Typography>
				<Typography sx={{ mb: 1.5 }} color="text.secondary">
					<Link
						to={`/users/${username}`}
						style={{ textDecoration: 'none' }}
					>{`@${username}`}</Link>
				</Typography>
				<Typography variant="body2">
					{availability.map((singleAvailability) => (
						<Typography>{singleAvailability}</Typography>
					))}
					<br />
				</Typography>
				<Stack spacing={1} direction="row" variant="body2">
					{skills.map((singleSkill) => (
						<Chip label={singleSkill} key={singleSkill} />
					))}
					<br />
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
