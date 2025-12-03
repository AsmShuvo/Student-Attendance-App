#include <bits/stdc++.h>
using namespace std;

#define int long long int

void solve()
{
    int n, k;
    cin >> n >> k;
    string s;
    cin >> s;

    int n0 = 0;
    int n1 = 0;
    for (char c : s)
    {
        if (c == '0')
            n0++;
        else
            n1++;
    }

    int q = n / k, r = n % k, ll = q + 1, ls = q;

    int mpl = (ll + 1) / 2;
    int mps = (ls + 1) / 2, mtc = r * mpl + (k - r) * mps;

    if (max(n0, n1) <= mtc)
    {
        cout << "Yes" << endl;
    }
    else
    {
        cout << "No" << endl;
    }
}

int32_t main()
{
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int t;
    cin >> t;
    while (t--)
    {
        solve();
    }

    return 0;
}