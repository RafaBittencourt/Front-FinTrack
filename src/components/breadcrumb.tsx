import { NavLink } from 'react-router-dom'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface IBreadcrumbComponentRoutes {
  displayRout: string
  route?: string
}

interface IBreadcrumbComponent {
  routes: IBreadcrumbComponentRoutes[]
}

export function BreadcrumbComponent({ routes }: IBreadcrumbComponent) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink>
            <NavLink to={'/dashboard'}>Home</NavLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {routes.map((values: IBreadcrumbComponentRoutes, index: number) => {
          return (
            <div key={index}>
              <BreadcrumbItem>
                {values.route ? (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbLink>
                      <NavLink to={values.route}>{values.displayRout}</NavLink>
                    </BreadcrumbLink>
                  </>
                ) : (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbLink>{values.displayRout}</BreadcrumbLink>
                  </>
                )}
              </BreadcrumbItem>
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
