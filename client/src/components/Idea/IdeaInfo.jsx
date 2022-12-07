import { Card, Stack, Box, Typography } from '@mui/material';
import React from 'react';
import Technologies from 'components/Idea/Technologies';
import CommentList from 'components/CommentsList/CommentList';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

function IdeaInfo({ idea }) {
	return (
		<Card
			sx={{
				p: 1,
			}}
		>
			<Box
				sx={{
					p: 1,
				}}
			>
				<Typography
					variant="h4"
					component="h2"
					sx={{
						p: 1,
					}}
				>
					{idea.name}
				</Typography>
				<Stack
					sx={{
						p: 1,
					}}
				>
					<div>
						<Typography variant="h8" component="p">
							Owner:
						</Typography>
						{idea.owner.username}
					</div>
				</Stack>
				<Stack
					sx={{
						p: 1,
					}}
				>
					<Technologies technologies={idea.technologies} />
				</Stack>
				<Stack
					sx={{
						p: 1,
					}}
				>
					<div>
						<Typography variant="h8" component="p">
							Description:
						</Typography>
						{idea.description}
					</div>
				</Stack>
				<Stack
					sx={{
						p: 1,
					}}
				>
					<div>
						<Typography variant="h8" component="p">
							Created At:
						</Typography>
						{idea.createdAt}
					</div>
				</Stack>
				<Stack
					sx={{
						p: 1,
					}}
				>
					<div>
						<Typography variant="h8" component="p">
							Status:
						</Typography>
						{idea.status}
					</div>
				</Stack>
				<Stack
					sx={{
						p: 1,
					}}
				>
					<div>
						<Typography variant="h8" component="p">
							Looking For:
						</Typography>
						{idea.lookingFor}
					</div>
				</Stack>
				<Stack
					sx={{
						p: 1,
					}}
				>
					<div>
						<Typography variant="h8" component="p">
							Likes:
							<ThumbUpIcon />
						</Typography>
						{idea.likes.length}
					</div>
				</Stack>
				<Card
					sx={{
						p: 1,
					}}
				>
					<div>
						<Typography variant="h8" component="p">
							Comments:
						</Typography>
						<CommentList commentsList={idea.comments} />
					</div>
				</Card>
			</Box>
		</Card>
	);
}

export default IdeaInfo;
