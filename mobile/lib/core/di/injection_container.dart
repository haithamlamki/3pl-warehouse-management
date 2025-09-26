import 'package:dio/dio.dart';
import 'package:get_it/get_it.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../config/app_config.dart';
import '../../features/auth/data/datasources/auth_local_datasource.dart';
import '../../features/auth/data/datasources/auth_remote_datasource.dart';
import '../../features/auth/data/repositories/auth_repository_impl.dart';
import '../../features/auth/domain/repositories/auth_repository.dart';
import '../../features/auth/domain/usecases/login_usecase.dart';
import '../../features/auth/domain/usecases/logout_usecase.dart';
import '../../features/auth/domain/usecases/refresh_token_usecase.dart';
import '../../features/delivery/data/datasources/delivery_local_datasource.dart';
import '../../features/delivery/data/datasources/delivery_remote_datasource.dart';
import '../../features/delivery/data/repositories/delivery_repository_impl.dart';
import '../../features/delivery/domain/repositories/delivery_repository.dart';
import '../../features/delivery/domain/usecases/get_routes_usecase.dart';
import '../../features/delivery/domain/usecases/start_route_usecase.dart';
import '../../features/delivery/domain/usecases/complete_stop_usecase.dart';
import '../../features/delivery/domain/usecases/submit_epod_usecase.dart';

final sl = GetIt.instance;

Future<void> setupDependencyInjection() async {
  // External
  final sharedPreferences = await SharedPreferences.getInstance();
  sl.registerLazySingleton(() => sharedPreferences);
  
  // Dio
  sl.registerLazySingleton(() {
    final dio = Dio();
    dio.options.baseUrl = AppConfig.baseUrl + AppConfig.apiVersion;
    dio.options.connectTimeout = AppConfig.connectTimeout;
    dio.options.receiveTimeout = AppConfig.receiveTimeout;
    dio.options.sendTimeout = AppConfig.sendTimeout;
    
    // Add interceptors
    dio.interceptors.add(LogInterceptor(
      requestBody: true,
      responseBody: true,
      error: true,
    ));
    
    return dio;
  });

  // Data sources
  sl.registerLazySingleton<AuthLocalDataSource>(
    () => AuthLocalDataSourceImpl(sl()),
  );
  sl.registerLazySingleton<AuthRemoteDataSource>(
    () => AuthRemoteDataSourceImpl(sl()),
  );
  sl.registerLazySingleton<DeliveryLocalDataSource>(
    () => DeliveryLocalDataSourceImpl(sl()),
  );
  sl.registerLazySingleton<DeliveryRemoteDataSource>(
    () => DeliveryRemoteDataSourceImpl(sl()),
  );

  // Repositories
  sl.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(sl(), sl()),
  );
  sl.registerLazySingleton<DeliveryRepository>(
    () => DeliveryRepositoryImpl(sl(), sl()),
  );

  // Use cases
  sl.registerLazySingleton(() => LoginUseCase(sl()));
  sl.registerLazySingleton(() => LogoutUseCase(sl()));
  sl.registerLazySingleton(() => RefreshTokenUseCase(sl()));
  sl.registerLazySingleton(() => GetRoutesUseCase(sl()));
  sl.registerLazySingleton(() => StartRouteUseCase(sl()));
  sl.registerLazySingleton(() => CompleteStopUseCase(sl()));
  sl.registerLazySingleton(() => SubmitEPodUseCase(sl()));
}
