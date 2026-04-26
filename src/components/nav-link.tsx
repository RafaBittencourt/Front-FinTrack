import { Link, LinkProps } from 'react-router-dom'

import { navLinkStyleSelected } from './nav-style'

export type NavLinkProps = LinkProps

export function NavLink(props: NavLinkProps) {
  return (
    <Link
      className="flex items-center text-sm font-medium transition-colors hover:bg-white/10 hover:text-white rounded-md p-1"
      style={location.pathname === props.to ? navLinkStyleSelected : {}}
      {...props}
    />
  )
}
