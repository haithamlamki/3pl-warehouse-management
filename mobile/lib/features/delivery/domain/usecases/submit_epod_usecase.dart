import 'dart:typed_data';
import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../repositories/delivery_repository.dart';

class SubmitEPodUseCase {
  final DeliveryRepository _repository;

  SubmitEPodUseCase(this._repository);

  Future<Either<Failure, void>> call(SubmitEPodParams params) async {
    return await _repository.submitEPod(
      signerName: params.signerName,
      signerId: params.signerId,
      photos: params.photos,
      signatureBytes: params.signatureBytes,
      notes: params.notes,
    );
  }
}

class SubmitEPodParams {
  final String signerName;
  final String? signerId;
  final List<dynamic> photos;
  final Uint8List? signatureBytes;
  final String notes;

  SubmitEPodParams({
    required this.signerName,
    this.signerId,
    required this.photos,
    this.signatureBytes,
    required this.notes,
  });
}
