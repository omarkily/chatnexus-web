"use client";

import { title, subtitle } from "@/components/primitives";
import { GreenCard } from "@/components/green-card";
import { GreenStatItem, GreenStatsGrid } from "@/components/green-stats";

export default function OverviewPage() {
  return (
    <div className="flex flex-col w-full gap-8 pb-10">
      {/* Stats Section */}
      <GreenStatsGrid>
        <GreenStatItem
          label="Active Users"
          value="2,549"
          trend={{ value: 12.5, isPositive: true }}
          accentColor="emerald"
        />
        <GreenStatItem
          label="Total Conversations"
          value="14,328"
          trend={{ value: 8.3, isPositive: true }}
          accentColor="green"
        />
        <GreenStatItem
          label="Avg. Response Time"
          value="1.2s"
          trend={{ value: 4.1, isPositive: true }}
          accentColor="teal"
        />
        <GreenStatItem
          label="Message Completion"
          value="99.8%"
          trend={{ value: 0.3, isPositive: true }}
          accentColor="emerald"
        />
      </GreenStatsGrid>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GreenCard title="Latest Features" variant="solid" className="col-span-1">
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Real-time response streaming</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Multi-language support (23 languages)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Advanced knowledge base integration</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Customizable AI personality traits</span>
            </li>
          </ul>
        </GreenCard>

        <GreenCard
          title="Performance Overview"
          variant="glass"
          className="col-span-1 lg:col-span-2 min-h-[200px]"
        >
          <div className="space-y-4">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-200">
                    Response Accuracy
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-emerald-600">94%</span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-emerald-200">
                <div
                  style={{ width: "94%" }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
                ></div>
              </div>
            </div>

            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                    Uptime
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-green-600">99.9%</span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                <div
                  style={{ width: "99.9%" }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                ></div>
              </div>
            </div>

            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                    User Satisfaction
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-teal-600">91%</span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-teal-200">
                <div
                  style={{ width: "91%" }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"
                ></div>
              </div>
            </div>
          </div>
        </GreenCard>
      </div>

      {/* Additional Card with green accent */}
      <GreenCard title="ChatNexus AI Insights" variant="outlined" className="w-full">
        <p className="text-sm mb-4">
          ChatNexus AI has processed over 2.3 million conversations this month, with a 27% increase
          in complex query resolution compared to the previous quarter.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
            Natural Language Processing
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            Knowledge Management
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300">
            Machine Learning
          </span>
        </div>
      </GreenCard>

      {/* Usage Metrics Section - Additional content to demonstrate scrolling */}
      <div className="border-t border-emerald-200/30 dark:border-emerald-900/30 pt-8 mt-2">
        <h2 className="text-xl font-bold mb-6 text-emerald-700 dark:text-emerald-400">
          Usage Metrics
        </h2>

        <GreenStatsGrid className="mb-8">
          <GreenStatItem
            label="API Calls"
            value="1.4M"
            trend={{ value: 18.2, isPositive: true }}
            accentColor="teal"
          />
          <GreenStatItem
            label="Avg. Session Duration"
            value="4m 32s"
            trend={{ value: 5.7, isPositive: true }}
            accentColor="emerald"
          />
          <GreenStatItem
            label="Message Token Usage"
            value="54.3M"
            trend={{ value: 22.1, isPositive: true }}
            accentColor="green"
          />
          <GreenStatItem
            label="Error Rate"
            value="0.02%"
            trend={{ value: 0.01, isPositive: false }}
            accentColor="emerald"
          />
        </GreenStatsGrid>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <GreenCard title="Regional Distribution" variant="glass">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">North America</span>
                <span className="text-sm font-medium">42%</span>
              </div>
              <div className="h-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "42%" }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Europe</span>
                <span className="text-sm font-medium">28%</span>
              </div>
              <div className="h-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "28%" }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Asia-Pacific</span>
                <span className="text-sm font-medium">23%</span>
              </div>
              <div className="h-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "23%" }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Other Regions</span>
                <span className="text-sm font-medium">7%</span>
              </div>
              <div className="h-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "7%" }}></div>
              </div>
            </div>
          </GreenCard>

          <GreenCard title="Top Integration Channels" variant="solid">
            <ul className="space-y-4">
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <span>Website Widgets</span>
                </div>
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  38%
                </span>
              </li>

              <li className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <span className="text-xs font-bold">2</span>
                  </div>
                  <span>Mobile Applications</span>
                </div>
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  29%
                </span>
              </li>

              <li className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <span className="text-xs font-bold">3</span>
                  </div>
                  <span>API Integrations</span>
                </div>
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  22%
                </span>
              </li>

              <li className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <span className="text-xs font-bold">4</span>
                  </div>
                  <span>Messaging Platforms</span>
                </div>
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  11%
                </span>
              </li>
            </ul>
          </GreenCard>
        </div>
      </div>

      {/* Final green card to demonstrate scrolling */}
      <GreenCard title="AI Training Progress" variant="outlined" className="w-full">
        <div className="space-y-4">
          <p className="text-sm">
            The ChatNexus AI model has been improved with 1.2TB of new training data, enhancing its
            capabilities in technical support, medical advice, and legal consultation domains.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-2">
                Model Version
              </h4>
              <div className="text-lg font-semibold text-emerald-800 dark:text-emerald-300">
                v3.2.1
              </div>
              <div className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-1">
                Released 3 days ago
              </div>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-2">
                Training Completion
              </h4>
              <div className="text-lg font-semibold text-emerald-800 dark:text-emerald-300">
                100%
              </div>
              <div className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-1">
                12 million parameters
              </div>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-2">
                Performance Gain
              </h4>
              <div className="text-lg font-semibold text-emerald-800 dark:text-emerald-300">
                +18.5%
              </div>
              <div className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-1">
                vs previous version
              </div>
            </div>
          </div>
        </div>
      </GreenCard>
    </div>
  );
}
