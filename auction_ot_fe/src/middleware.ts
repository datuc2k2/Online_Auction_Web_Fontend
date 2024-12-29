import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routes_need_admin_employee_role, routes_need_login } from './app/auth_route_name';
import { openNotification } from './utility/Utility';
import store from './store/Store';

export function middleware(request: NextRequest) {
    // const state = store.getState();
    // const myInfo = state.auth.myInfo;
    // console.log('myInfo333:: ',myInfo);
    
    // Read token and user info from cookies
    const token = request.cookies.get('accessTokenAuction')?.value;
    const storedInfo = JSON.parse(request.cookies.get('myInfo')?.value || '{}');
    
    // Required login logic
    if (routes_need_login?.includes(request.nextUrl.pathname) && (!token || token === '')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    if (
      routes_need_admin_employee_role?.includes(request.nextUrl.pathname) &&
      storedInfo?.userRoleName !== 'Admin'
    ) {
        // openNotification('error', '', 'Bạn không có quyền truy cập');
        return NextResponse.redirect(new URL('/can-not-access-page', request.url));
    }
    if(Object.keys(storedInfo).length !== 0 && ['/login', '/register'].includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/:path*', // Match all routes
};
