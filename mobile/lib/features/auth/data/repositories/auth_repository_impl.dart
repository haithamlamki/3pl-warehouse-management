import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../domain/entities/user_entity.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_local_datasource.dart';
import '../datasources/auth_remote_datasource.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource _remoteDataSource;
  final AuthLocalDataSource _localDataSource;

  AuthRepositoryImpl(this._remoteDataSource, this._localDataSource);

  @override
  Future<Either<Failure, UserEntity>> login(String email, String password) async {
    try {
      final result = await _remoteDataSource.login(email, password);
      
      // Save tokens locally
      await _localDataSource.saveAuthTokens(
        result['accessToken'] as String,
        result['refreshToken'] as String,
      );
      
      // Save user data
      await _localDataSource.saveUserData(result['user'] as Map<String, dynamic>);
      
      final user = UserEntity.fromJson(result['user'] as Map<String, dynamic>);
      return Right(user);
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> logout() async {
    try {
      await _localDataSource.clearAuthData();
      return const Right(null);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, UserEntity>> refreshToken() async {
    try {
      final refreshToken = await _localDataSource.getRefreshToken();
      if (refreshToken == null) {
        return const Left(AuthenticationFailure('No refresh token found'));
      }

      final result = await _remoteDataSource.refreshToken(refreshToken);
      
      // Save new tokens
      await _localDataSource.saveAuthTokens(
        result['accessToken'] as String,
        result['refreshToken'] as String,
      );
      
      final user = UserEntity.fromJson(result['user'] as Map<String, dynamic>);
      return Right(user);
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  @override
  Future<Either<Failure, UserEntity?>> getCurrentUser() async {
    try {
      final userData = await _localDataSource.getUserData();
      if (userData == null) {
        return const Right(null);
      }
      
      final user = UserEntity.fromJson(userData);
      return Right(user);
    } catch (e) {
      return Left(CacheFailure(e.toString()));
    }
  }
}
