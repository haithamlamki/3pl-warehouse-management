import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/presentation/providers/auth_provider.dart';
import '../../features/auth/presentation/pages/login_page.dart';
import '../../features/delivery/presentation/pages/home_page.dart';
import '../../features/delivery/presentation/pages/route_details_page.dart';
import '../../features/delivery/presentation/pages/stop_details_page.dart';
import '../../features/delivery/presentation/pages/epod_page.dart';
import '../../features/profile/presentation/pages/profile_page.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authProvider);
  
  return GoRouter(
    initialLocation: '/login',
    redirect: (context, state) {
      final isLoggedIn = authState.when(
        data: (user) => user != null,
        loading: () => false,
        error: (_, __) => false,
      );
      
      final isLoggingIn = state.matchedLocation == '/login';
      
      if (!isLoggedIn && !isLoggingIn) {
        return '/login';
      }
      
      if (isLoggedIn && isLoggingIn) {
        return '/home';
      }
      
      return null;
    },
    routes: [
      GoRoute(
        path: '/login',
        name: 'login',
        builder: (context, state) => const LoginPage(),
      ),
      GoRoute(
        path: '/home',
        name: 'home',
        builder: (context, state) => const HomePage(),
        routes: [
          GoRoute(
            path: '/route/:routeId',
            name: 'route-details',
            builder: (context, state) {
              final routeId = state.pathParameters['routeId']!;
              return RouteDetailsPage(routeId: routeId);
            },
            routes: [
              GoRoute(
                path: '/stop/:stopId',
                name: 'stop-details',
                builder: (context, state) {
                  final stopId = state.pathParameters['stopId']!;
                  return StopDetailsPage(stopId: stopId);
                },
                routes: [
                  GoRoute(
                    path: '/epod',
                    name: 'epod',
                    builder: (context, state) => const EPodPage(),
                  ),
                ],
              ),
            ],
          ),
          GoRoute(
            path: '/profile',
            name: 'profile',
            builder: (context, state) => const ProfilePage(),
          ),
        ],
      ),
    ],
  );
});
