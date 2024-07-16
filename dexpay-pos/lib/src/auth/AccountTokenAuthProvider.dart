import 'package:lightspark_wallet/lightspark_wallet.dart';

class AccountAuthProvider implements AuthProvider {
  @override
  String? get authHeaderKey => 'Authorization';

  @override
  Future<String?> getAuthToken() async {
    return 'Basic MDE5MGFmOTNmMDNjNGY4OTAwMDBkYWMxZGY1ZDBhOTA6NnZtczljR2V2aS1ObExEanRUdDZ3Tjl4UHdLYzU3Ymh1SjRlU0ZSdDRCbw==';
  }

  @override
  Future<bool> isAuthorized() async {
    return true;
  }

  @override
  Future<Map<String, Object>> getWsConnectionParams() async {
    return {
      "client_id": "0190af93f03c4f890000dac1df5d0a90",
      "client_secret": "6vms9cGevi-NlLDjtTt6wN9xPwKc57bhuJ4eSFRt4Bo",
    };
  }
}
