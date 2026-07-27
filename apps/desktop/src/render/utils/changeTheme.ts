function changeTheme(theme: string) {
  const root = document.documentElement;
  if (theme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else {
    document.body.removeAttribute('data-theme');
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }
}

export default changeTheme;
