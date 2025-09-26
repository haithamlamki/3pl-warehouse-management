import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../repositories/delivery_repository.dart';

class StartRouteUseCase {
  final DeliveryRepository _repository;

  StartRouteUseCase(this._repository);

  Future<Either<Failure, void>> call(StartRouteParams params) async {
    return await _repository.startRoute(params.routeId);
  }
}

class StartRouteParams {
  final String routeId;

  StartRouteParams({required this.routeId});
}
