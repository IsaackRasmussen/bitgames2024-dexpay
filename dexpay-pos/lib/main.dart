import 'dart:convert';

import 'package:intl/intl.dart';
import 'dart:async';

import 'package:flutter/material.dart';

import 'package:shared_preferences/shared_preferences.dart';
import 'package:lightspark_wallet/lightspark_wallet.dart';
import 'package:provider/provider.dart';
import 'src/model/lightspark_client_notifier.dart';
import 'package:http/http.dart' as http;
import 'package:json_annotation/json_annotation.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => LightsparkClientNotifier(
        LightsparkWalletClient(
          authProvider: JwtAuthProvider(SecureStorageJwtStorage()),
          serverUrl: "api.dev.dev.sparkinfra.net"
        ),
      ),
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'dExPay POS',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // TRY THIS: Try running your application with "flutter run". You'll see
        // the application has a purple toolbar. Then, without quitting the app,
        // try changing the seedColor in the colorScheme below to Colors.green
        // and then invoke "hot reload" (save your changes or press the "hot
        // reload" button in a Flutter-supported IDE, or press "r" if you used
        // the command line to start the app).
        //
        // Notice that the counter didn't reset back to zero; the application
        // state is not lost during the reload. To reset the state, use hot
        // restart instead.
        //
        // This works for code too, not just values: Most code changes can be
        // tested with just a hot reload.
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'dExPay POS'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  String _settingsTokenClientId = "";
  String _settingsTokenClientSecret = "";
  String _settingsAccountId = "";
  double _settingsAccountOwnedBalance = 0;
  double _settingsAccountAvailableToSendBalance = 0;
  double _settingsAccountAvailableToWithdrawBalance = 0;
  double _cashAmount = 0;
  final NumberFormat _numberFormat = NumberFormat("#,##0.00", "en_US");
  bool _isLightSparkLoggedIn = false;

  Future<void> _saveSettings() async {
    final prefs = await SharedPreferences.getInstance();

    prefs.setString("LinkSparkTokenClientId", _settingsTokenClientId);
    prefs.setString("LinkSparkTokenClientSecret", _settingsTokenClientSecret);
    prefs.setString("LinkSparkAccountId", _settingsAccountId);
  }

  Future<void> _loadSettings() async {
    final prefs = await SharedPreferences.getInstance();

    setState(() {
      _settingsTokenClientId = prefs.getString("LinkSparkTokenClientId") ?? '';
      _settingsTokenClientSecret =
          prefs.getString("LinkSparkTokenClientSecret") ?? '';
      _settingsAccountId = prefs.getString("LinkSparkAccountId") ?? '';
    });
  }

  Future<void> _getLightsparkBalances() async {
    if (_settingsAccountId == "") return;

    if (!_isLightSparkLoggedIn) {
      final authToken = await _fetchToken();
      _isLightSparkLoggedIn =
          await _loginWithJwt(_settingsAccountId, authToken);
    }

    if (!_isLightSparkLoggedIn) return;

    final client = Provider.of<LightsparkClientNotifier>(
      context,
      listen: false,
    ).value;

    Wallet? currentWallet = await client.getCurrentWallet();

    if (currentWallet == null || currentWallet?.status == WalletStatus.NOT_SETUP) {
      // The wallet is not setup, so we need to deploy it.
      var wallet = await client.deployWallet();
      while (wallet.status != WalletStatus.DEPLOYED &&
          wallet.status != WalletStatus.FAILED) {
        await Future.delayed(const Duration(seconds: 2));
        currentWallet = await client.getCurrentWallet();
      }
    }

    if (currentWallet?.balances != null) {
      _settingsAccountOwnedBalance =
          currentWallet?.balances?.ownedBalance.originalValue as double;
      _settingsAccountAvailableToSendBalance = currentWallet
          ?.balances?.availableToSendBalance.originalValue as double;
      _settingsAccountAvailableToWithdrawBalance = currentWallet
          ?.balances?.availableToWithdrawBalance.originalValue as double;
    }
  }

  Future<bool> _loginWithJwt(String accountId, String jwt) async {
    try {
      final client = Provider.of<LightsparkClientNotifier>(
        context,
        listen: false,
      ).value;

      final jwtAuthStorage = SecureStorageJwtStorage();

      await client.loginWithJwt(
        accountId,
        jwt,
        jwtAuthStorage,
      );
      final loggedIn = await client.isAuthorized();
      setState(() {
        _isLightSparkLoggedIn = loggedIn;
      });

      return loggedIn;
    } on Exception catch (except) {
      print("Failed to login with JWT: " + except.toString());
    }
    return false;
  }

  Future<String> _fetchToken() async {
    final response =
        await http.get(Uri.parse('http://192.168.2.114:5173/api/auth/token'));

    final auth = jsonDecode(response.body) as Map<String, dynamic>;

    return auth['token'];
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final client = Provider.of<LightsparkClientNotifier>(
      context,
      listen: false,
    ).value;
    client.isAuthorized().then((value) {
      setState(() {
        _isLightSparkLoggedIn = value;
      });
    });
  }

  @override
  void initState() {
    super.initState();

    _loadSettings().whenComplete(() {
      _getLightsparkBalances();
    });
  }

  @override
  Widget build(BuildContext context) {
    // This method is rerun every time setState is called, for instance as done
    // by the _incrementCounter method above.
    //
    // The Flutter framework has been optimized to make rerunning build methods
    // fast, so that you can just rebuild anything that needs updating rather
    // than having to individually change instances of widgets.
    return DefaultTabController(
        initialIndex: 0,
        length: 3,
        child: Scaffold(
          appBar: AppBar(
            title: const Text("dExPay POS"),
            bottom: const TabBar(
              tabs: <Widget>[
                Tab(
                  icon: Icon(Icons.local_drink),
                  text: 'POS',
                ),
                Tab(
                  icon: Icon(Icons.table_bar_rounded),
                  text: 'Tables',
                ),
                Tab(
                  icon: Icon(Icons.settings),
                  text: 'Settings',
                ),
              ],
            ),
          ),
          body: TabBarView(children: <Widget>[
            Center(
              // Center is a layout widget. It takes a single child and positions it
              // in the middle of the parent.
              child: Column(
                // Column is also a layout widget. It takes a list of children and
                // arranges them vertically. By default, it sizes itself to fit its
                // children horizontally, and tries to be as tall as its parent.
                //
                // Column has various properties to control how it sizes itself and
                // how it positions its children. Here we use mainAxisAlignment to
                // center the children vertically; the main axis here is the vertical
                // axis because Columns are vertical (the cross axis would be
                // horizontal).
                //
                // TRY THIS: Invoke "debug painting" (choose the "Toggle Debug Paint"
                // action in the IDE, or press "p" in the console), to see the
                // wireframe for each widget.
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Expanded(
                      child: GridView.count(
                    primary: false,
                    padding: const EdgeInsets.all(20),
                    crossAxisSpacing: 10,
                    mainAxisSpacing: 10,
                    crossAxisCount: 2,
                    shrinkWrap: true,
                    childAspectRatio: 4 / 1,
                    scrollDirection: Axis.vertical,
                    children: <Widget>[
                      OutlinedButton(
                          onPressed: () {}, child: const Text("Beers")),
                      OutlinedButton(
                          onPressed: () {}, child: const Text("Cocktails")),
                      OutlinedButton(
                          onPressed: () {}, child: const Text("Snacks")),
                      OutlinedButton(
                          onPressed: () {}, child: const Text("Free Amount")),
                    ],
                  )),
                  TextFormField(
                      initialValue: _cashAmount.toString(),
                      onChanged: (value) {
                        setState(() {
                          _cashAmount = double.parse(value);
                        });
                      },
                      obscureText: false,
                      textAlign: TextAlign.center,
                      decoration: const InputDecoration(
                        labelText: 'Amount',
                      )),
                  SearchAnchor(builder:
                      (BuildContext context, SearchController controller) {
                    return SearchBar(
                      controller: controller,
                      padding: const WidgetStatePropertyAll(
                          EdgeInsets.symmetric(horizontal: 16.0)),
                      onTap: () {
                        controller.openView();
                      },
                      onChanged: (_) {
                        controller.openView();
                      },
                      leading: const Icon(Icons.search),
                      trailing: <Widget>[
                        Tooltip(
                          message: 'Change brightness mode',
                          child: IconButton(
                            onPressed: () {
                              setState(() {});
                            },
                            icon: const Icon(Icons.wb_sunny_outlined),
                            selectedIcon:
                                const Icon(Icons.brightness_2_outlined),
                          ),
                        )
                      ],
                    );
                  }, suggestionsBuilder:
                      (BuildContext context, SearchController controller) {
                    return List<ListTile>.generate(5, (int index) {
                      final String item = 'item $index';
                      return ListTile(
                        title: Text(item),
                        onTap: () {
                          setState(() {
                            controller.closeView(item);
                          });
                        },
                      );
                    });
                  }),
                ],
              ),
            ),
            const Center(child: Text('Tables')),
            Container(
                padding: const EdgeInsets.all(50),
                child: Column(
                  children: <Widget>[
                    Container(
                      margin: const EdgeInsets.all(10),
                      child: Column(
                        children: <Widget>[
                          Text(
                              "Owned Balance: ${(_numberFormat.format(_settingsAccountOwnedBalance))}"),
                          Text(
                              "Available to send Balance: ${(_numberFormat.format(_settingsAccountAvailableToSendBalance))}"),
                          Text(
                              "Available to withdraw Balance: ${(_numberFormat.format(_settingsAccountAvailableToWithdrawBalance))}")
                        ],
                      ),
                    ),
                    const SizedBox(height: 30),
                    TextFormField(
                      initialValue: _settingsTokenClientId,
                      onChanged: (value) {
                        setState(() {
                          _settingsTokenClientId = value;
                        });
                      },
                      obscureText: false,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        labelText: 'Token Client Id',
                      ),
                    ),
                    const SizedBox(height: 10),
                    TextFormField(
                      initialValue: _settingsTokenClientSecret,
                      onChanged: (value) {
                        setState(() {
                          _settingsTokenClientSecret = value;
                        });
                      },
                      obscureText: true,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        labelText: 'Client Secret',
                      ),
                    ),
                    const SizedBox(height: 10),
                    TextFormField(
                      initialValue: _settingsAccountId,
                      onChanged: (value) {
                        setState(() {
                          _settingsAccountId = value;
                        });
                      },
                      obscureText: false,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        labelText: 'Lightspark Account Id',
                      ),
                    ),
                    const SizedBox(height: 10),
                    FilledButton(
                        onPressed: () {
                          _saveSettings();
                          _getLightsparkBalances();
                        },
                        child: const Text("Update")),
                  ],
                ))
          ]),
          floatingActionButton: const FloatingActionButton(
            onPressed: null,
            tooltip: 'Tables',
            child: const Icon(Icons.table_bar),
          ), // This trailing comma makes auto-formatting nicer for build methods.
        ));
  }
}
