import React, { useEffect, useMemo, useState } from 'react';
import {
  Clock,
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  ChefHat,
} from 'lucide-react';
import StatCard from '../ui/StatCard';
import Chart from '../ui/Chart';

/* ---------- helpers ---------- */
const formatLKR = (value) => {
  const n = Number(value) || 0;
  const parts = n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `Rs ${parts}/=`;
};

const hourLabel = (h) => {
  const ampm = h < 12 ? 'AM' : 'PM';
  const hour = h % 12 || 12;
  return `${hour} ${ampm}`;
};

/* ---------- lightweight UI primitives ---------- */
const Card = ({ className = '', children }) => (
  <div
    className={[
      'rounded-2xl border border-gray-200/70 bg-white/70 backdrop-blur-sm shadow-sm',
      'dark:bg-gray-900/60 dark:border-white/10',
      className,
    ].join(' ')}
  >
    {children}
  </div>
);

const CardHeader = ({ title, actions, subtitle }) => (
  <div className="flex items-center justify-between gap-3 p-4">
    <div>
      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      {subtitle ? (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
      ) : null}
    </div>
    <div className="flex items-center gap-2">{actions}</div>
  </div>
);

const Chip = ({ children, tone = 'default' }) => {
  const tones = {
    default: 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-200',
    green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
};

/* ---------- enhanced inline bar chart (grid + hover) ---------- */
const MiniBarChart = ({ data, height = 160, barWidth = 14, gap = 6, onHoverIndex }) => {
  const [hoverIdx, setHoverIdx] = useState(null);
  const max = Math.max(...data, 1);
  const width = data.length * (barWidth + gap) + gap;

  const gridLines = 4; // horizontal lines

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-44"
        role="img"
        aria-label="Orders by hour"
      >
        {/* grid */}
        {[...Array(gridLines + 1)].map((_, i) => {
          const y = (i / gridLines) * height;
          return (
            <line
              key={i}
              x1="0"
              y1={y}
              x2={width}
              y2={y}
              className="stroke-gray-200 dark:stroke-white/10"
              strokeWidth="1"
            />
          );
        })}

        {/* bars */}
        {data.map((v, i) => {
          const h = (v / max) * (height - 10);
          const x = gap + i * (barWidth + gap);
          const y = height - h;
          const isHover = hoverIdx === i;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={h}
                rx="6"
                className={`transition-all ${
                  isHover
                    ? 'fill-emerald-600'
                    : 'fill-emerald-500/80 hover:fill-emerald-600'
                }`}
                onMouseEnter={() => {
                  setHoverIdx(i);
                  onHoverIndex?.(i);
                }}
                onMouseLeave={() => {
                  setHoverIdx(null);
                  onHoverIndex?.(null);
                }}
              />
            </g>
          );
        })}
      </svg>

      {/* bottom axis (every 3 hours to reduce clutter) */}
      <div className="mt-2 grid grid-cols-8 text-[10px] text-gray-500 dark:text-gray-400">
        {[0, 3, 6, 9, 12, 15, 18, 21].map((h) => (
          <span key={h} className="text-center">{hourLabel(h)}</span>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  /* ------ existing header controls ------ */
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [range, setRange] = useState('30d'); // '7d' | '30d' | '90d' | 'ytd'
  const [hoverHourIdx, setHoverHourIdx] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setLastUpdated(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 800)); // mock fetch
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  /* ------ KPIs ------ */
  const stats = useMemo(
    () => [
      { title: 'Total Revenue', value: 'Rs — ', icon: DollarSign, color: 'green' },
      { title: 'Total Orders', value: '—', icon: ShoppingCart, color: 'blue' },
      { title: 'Customers', value: '—', icon: Users, color: 'purple' },
      { title: 'Avg. Order Value', value: 'Rs —', icon: TrendingUp, color: 'orange' },
    ],
    []
  );

  /* ------ Orders by Hour (sample data) ------ */
  const ordersByHour = [
    1, 0, 0, 0, 1, 2, 4, 7, 10, 12, 14, 16,
    15, 17, 14, 10, 9, 13, 18, 21, 16, 12, 8, 4,
  ];
  const totalOrders = ordersByHour.reduce((a, b) => a + b, 0);
  const peakHour = ordersByHour.reduce((acc, val, i) => (val > ordersByHour[acc] ? i : acc), 0);
  const offPeakHour = ordersByHour.reduce((acc, val, i) => (val < ordersByHour[acc] ? i : acc), 0);

  /* ------ Top Menu Items (replace with real data) ------ */
  const topItems = [
    { id: '1', name: 'Hot Egg Spicy Ramen', category: 'Ramen', orders: 128, revenue: 140800, rating: 4.6 },
    { id: '2', name: 'Pork Soup', category: 'Soup', orders: 92, revenue: 82800, rating: 4.4 },
    { id: '3', name: 'Veg Su Tah Ramen', category: 'Ramen', orders: 77, revenue: 69300, rating: 4.3 },
    { id: '4', name: 'Chicken Katsu Bowl', category: 'Bowl', orders: 66, revenue: 79200, rating: 4.5 },
    { id: '5', name: 'Gyoza (6 pcs)', category: 'Side', orders: 58, revenue: 34800, rating: 4.2 },
  ];
  const maxTopOrders = Math.max(...topItems.map((i) => i.orders), 1);

  /* ------ Performance Summary (dummy deltas; swap with real) ------ */
  const perf = {
    revenueChange: +12.4,
    ordersChange: +7.2,
    aovChange: +4.8,
    retention: 42,
  };

  const Change = ({ value }) => {
    const up = value >= 0;
    const Icon = up ? ArrowUpRight : ArrowDownRight;
    return (
      <span className={`inline-flex items-center gap-1 text-sm font-medium ${up ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>
        <Icon className="w-4 h-4" />
        {Math.abs(value).toFixed(1)}%
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 via-white to-white p-6 shadow-sm dark:from-emerald-900/30 dark:via-gray-900/50 dark:to-gray-900 dark:border-white/10">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-800/20" />
        <div className="flex flex-wrap justify-between items-center gap-3 relative">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-emerald-800 dark:text-emerald-300">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back! Here's what's happening at Grand Minato.
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <Chip tone="blue">
              <Clock className="w-3.5 h-3.5" />
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </Chip>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition dark:bg-gray-900 dark:border-white/10 dark:text-gray-200 dark:hover:bg-gray-800"
              aria-busy={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing…' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* REVENUE CHART */}
      <Card>
        <CardHeader
          title="Revenue Overview"
          subtitle={`Showing ${range.toUpperCase()} revenue trend`}
          actions={
            <div className="inline-flex items-center p-0.5 rounded-xl bg-gray-100 dark:bg-white/10">
              {['7d', '30d', '90d', 'ytd'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setRange(opt)}
                  className={[
                    'px-3 py-1.5 text-sm rounded-[10px] transition',
                    range === opt
                      ? 'bg-white shadow-sm text-emerald-700 dark:bg-gray-800 dark:text-emerald-300'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white',
                  ].join(' ')}
                >
                  {opt === '7d' && '7D'}
                  {opt === '30d' && '30D'}
                  {opt === '90d' && '90D'}
                  {opt === 'ytd' && 'YTD'}
                </button>
              ))}
            </div>
          }
        />
        <div className="px-4 pb-4">
          {/* If supported: <Chart key={range} range={range} /> */}
          <Chart key={range} />
        </div>
      </Card>

      {/* ORDERS BY HOUR + TOP ITEMS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders by Hour */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Orders by Hour"
            subtitle="Distribution across the day"
            actions={<Chip tone="green">Total {totalOrders}</Chip>}
          />
          <div className="px-4 pb-4">
            <MiniBarChart data={ordersByHour} onHoverIndex={setHoverHourIdx} />
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <div className="text-gray-500 dark:text-gray-400">Peak Hour</div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {hourLabel(peakHour)} ({ordersByHour[peakHour]} orders)
                </div>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <div className="text-gray-500 dark:text-gray-400">Off-Peak</div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {hourLabel(offPeakHour)} ({ordersByHour[offPeakHour]} orders)
                </div>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <div className="text-gray-500 dark:text-gray-400">Avg / Hour</div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {(totalOrders / ordersByHour.length).toFixed(1)}
                </div>
              </div>
            </div>

            {/* hover readout */}
            <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
              {hoverHourIdx !== null
                ? <>Hover: <span className="font-medium text-gray-900 dark:text-gray-200">{hourLabel(hoverHourIdx)}</span> — {ordersByHour[hoverHourIdx]} orders</>
                : 'Hover bars to inspect an hour.'}
            </div>
          </div>
        </Card>

        {/* Top Menu Items */}
        <Card>
          <CardHeader
            title="Top Menu Items"
            actions={<ChefHat className="w-5 h-5 text-emerald-700 dark:text-emerald-300" />}
          />
          <div className="px-4 pb-4">
            <ul className="space-y-4">
              {topItems.map((item, idx) => (
                <li key={item.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold dark:bg-emerald-900/40 dark:text-emerald-300">
                    {idx + 1}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{item.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{item.category}</div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-700 dark:text-gray-200">{item.orders} orders</span>
                        <span className="text-gray-300 dark:text-gray-600">•</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{formatLKR(item.revenue)}</span>
                      </div>
                    </div>

                    {/* progress */}
                    <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden dark:bg-white/10">
                      <div
                        className="h-2 bg-emerald-600 dark:bg-emerald-500"
                        style={{ width: `${(item.orders / maxTopOrders) * 100}%` }}
                      />
                    </div>

                    {/* rating */}
                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      {item.rating.toFixed(1)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      {/* PERFORMANCE SUMMARY */}
      <Card>
        <CardHeader title="Performance Summary" />
        <div className="px-4 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5">
              <div className="text-gray-500 text-sm dark:text-gray-400">Revenue vs. prev. period</div>
              <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Change value={perf.revenueChange} />
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5">
              <div className="text-gray-500 text-sm dark:text-gray-400">Orders vs. prev. period</div>
              <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Change value={perf.ordersChange} />
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5">
              <div className="text-gray-500 text-sm dark:text-gray-400">Avg. Order Value</div>
              <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Change value={perf.aovChange} />
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5">
              <div className="text-gray-500 text-sm dark:text-gray-400">Customer Retention</div>
              <div className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {perf.retention}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Repeat purchase rate</div>
            </div>
          </div>

          <ul className="mt-4 list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
            <li>
              Peak demand at <span className="font-medium">{hourLabel(peakHour)}</span>; adjust staffing and prep for this window.
            </li>
            <li>
              <span className="font-medium">{topItems[0].name}</span> is your best-seller; feature in promos or bundles.
            </li>
            <li>
              Revenue trending <Change value={perf.revenueChange} /> with AOV <Change value={perf.aovChange} />.
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
