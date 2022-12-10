import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { handleError, logout } from 'utils/api-calls';
import { unsetUser } from 'store/user';
import { errorAlert } from 'store/alert';
import FavIcon from './favicon.png';

const pages = [
	{
		title: 'Projects',
		route: '/projects',
	},
	{
		title: 'Ideas',
		route: '/ideas',
	},
	{
		title: 'Hire Talent',
		route: '/hiring',
	},
];

function Navbar() {
	const [anchorElNav, setAnchorElNav] = React.useState(null);
	const [anchorElUser, setAnchorElUser] = React.useState(null);

	const user = useSelector((state) => state.user);

	const dispatch = useDispatch();

	const navigate = useNavigate();
	const location = useLocation();

	const isLoggedIn = React.useMemo(() => {
		return user !== null;
	}, [user]);

	const handleOpenNavMenu = (event) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	return (
		<AppBar
			sx={{
				backgroundColor: 'rgba(255,255,255,0.8)',
				backdropFilter: 'blur(20px)',
			}}
			position="sticky"
		>
			<Container>
				<Toolbar disableGutters>
					{/* Desktop Icon */}
					<Box
						sx={{
							display: { xs: 'none', md: 'flex' },
						}}
					>
						<Link
							style={{
								textDecoration: 'none',
								lineHeight: 0,
							}}
							to="/"
						>
							<img
								src={FavIcon}
								alt="Open Glass"
								style={{
									height: '3rem',
								}}
							/>
						</Link>
					</Box>
					{/* Mobile Hamburger Icon */}
					<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
						<IconButton
							size="large"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleOpenNavMenu}
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{
								display: { xs: 'block', md: 'none' },
							}}
						>
							{pages.map((page) => (
								<MenuItem key={page.title} onClick={handleCloseNavMenu}>
									<Typography textAlign="center">{page.title}</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
					{/* Mobile Logo */}
					<Box
						sx={{
							display: { xs: 'flex', md: 'none' },
							width: '100%',
							justifyContent: 'center',
						}}
					>
						<Link
							style={{
								textDecoration: 'none',
								lineHeight: 0,
							}}
							to="/"
						>
							<img
								src={FavIcon}
								alt="Open Glass"
								style={{
									height: '3rem',
								}}
							/>
						</Link>
					</Box>
					{/* Desktop Menu */}
					<Box
						sx={{
							flexGrow: 1,
							minHeight: 64,
							display: { xs: 'none', md: 'flex' },
							justifyContent: 'center',
							gap: 4,
						}}
					>
						{pages.map((page) => (
							<Button
								key={page.title}
								onClick={() => {
									navigate(page.route);
								}}
								sx={{
									py: 2,
									display: 'block',
									borderRadius: 0,
									color: 'black',
									'&:disabled': {
										borderTop: (theme) =>
											`3px solid ${theme.palette.primary.main}`,
										color: (theme) => theme.palette.primary.main,
										pt: '13px',
									},
								}}
								disabled={Boolean(location.pathname === page.route)}
							>
								{page.title}
							</Button>
						))}
					</Box>
					{/* Common - User Menu */}
					<Box sx={{ flexGrow: 0 }}>
						{isLoggedIn ? (
							<>
								<Button type="button" sx={{ mr: 2 }} variant="outlined">
									Create Idea
								</Button>
								<Button
									type="button"
									sx={{ mr: 2 }}
									variant="outlined"
									onClick={() => {
										navigate('/projects/create');
									}}
								>
									Create Project
								</Button>
								<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
									<Avatar
										alt={`${user.firstName} ${user.lastName}`}
										src="/static/images/avatar/2.jpg"
									/>
								</IconButton>
								<Menu
									sx={{ mt: '45px' }}
									id="menu-appbar"
									anchorEl={anchorElUser}
									anchorOrigin={{
										vertical: 'top',
										horizontal: 'right',
									}}
									keepMounted
									transformOrigin={{
										vertical: 'top',
										horizontal: 'right',
									}}
									open={Boolean(anchorElUser)}
									onClose={handleCloseUserMenu}
								>
									<MenuItem
										onClick={() => {
											navigate(`/users/${user.username}`);
											handleCloseUserMenu();
										}}
									>
										<Typography textAlign="center">Profile</Typography>
									</MenuItem>
									<MenuItem
										onClick={async () => {
											handleCloseUserMenu();
											try {
												await logout();
												dispatch(unsetUser());
											} catch (e) {
												let error = 'Unexpected error occurred';
												if (typeof handleError(e) === 'string')
													error = handleError(e);
												dispatch(errorAlert(error));
											}
										}}
									>
										<Typography textAlign="center">Log Out</Typography>
									</MenuItem>
								</Menu>
							</>
						) : (
							<Button
								variant="contained"
								size="large"
								type="button"
								startIcon={<LoginOutlinedIcon />}
								onClick={() => {
									navigate('/login');
								}}
							>
								LOGIN
							</Button>
						)}
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
}
export default Navbar;
