"use client";

import { MailIcon, TwitterIcon } from "lucide-react";
import { Separator } from "./ui/separator";
import Link from "next/link";

// import Link from "next/link";

export const Footer = () => {
	return (
		<div className="max-w-7xl mx-auto w-full bg-background/50 backdrop-blur-md rounded-2xl my-7">
			<footer className="">
				<div className="container px-6 py-8 mx-auto">
					<div className="flex flex-col md:flex-row md:flex-wrap justify-between gap-5">
						<div>
							<div className="text-lg text-primary font-bold uppercase">
								Portdex AI
							</div>

							<div className="grid grid-cols-2 lg:grid-cols-3 lg:gap-y-2 lg:gap-x-8 place-items-start">
								<Link
									href="/about"
									className="block mt-3 text-sm font-medium text-gray-500 duration-700 dark:text-gray-300 hover:text-gray-400 dark:hover:text-gray-200 hover:underline"
								>
									About us
								</Link>
								<Link
									href="/blockchain"
									className="block mt-3 text-sm font-medium text-gray-500 duration-700 dark:text-gray-300 hover:text-gray-400 dark:hover:text-gray-200 hover:underline"
								>
									Blockchain
								</Link>
								<Link
									href="/developers"
									className="block mt-3 text-sm font-medium text-gray-500 duration-700 dark:text-gray-300 hover:text-gray-400 dark:hover:text-gray-200 hover:underline"
								>
									Developers
								</Link>
								<Link
									href="/models"
									className="block mt-3 text-sm font-medium text-gray-500 duration-700 dark:text-gray-300 hover:text-gray-400 dark:hover:text-gray-200 hover:underline"
								>
									Models
								</Link>
								<Link
									href="/integration"
									className="block mt-3 text-sm font-medium text-gray-500 duration-700 dark:text-gray-300 hover:text-gray-400 dark:hover:text-gray-200 hover:underline"
								>
									Integrations
								</Link>
								<Link
									href="/roadmap"
									className="block mt-3 text-sm font-medium text-gray-500 duration-700 dark:text-gray-300 hover:text-gray-400 dark:hover:text-gray-200 hover:underline"
								>
									Roadmap
								</Link>
								<Link
									href="/marketplace"
									className="block mt-3 text-sm font-medium text-gray-500 duration-700 dark:text-gray-300 hover:text-gray-400 dark:hover:text-gray-200 hover:underline"
								>
									Marketplace
								</Link>

								{/* <Link
                  href="/ai-source-engine"
                  className="block mt-3 text-sm font-medium text-gray-500 duration-700 dark:text-gray-300 hover:text-gray-400 dark:hover:text-gray-200 hover:underline"
                >
                  AI Source Engine
                </Link> */}
								{/* <a
                  href="/automation-daily-task"
                  className="block mt-3 text-sm font-medium text-gray-500 duration-700 dark:text-gray-300 hover:text-gray-400 dark:hover:text-gray-200 hover:underline"
                >
                  Automated Daily Tasks
                </a> */}
								<Link
									href="/web3-agent"
									className="block mt-3 text-sm font-medium text-gray-500 duration-700 dark:text-gray-300 hover:text-gray-400 dark:hover:text-gray-200 hover:underline"
								>
									Web3.0 Agent AI
								</Link>
								<Link
									href="/agentic-ai"
									className="block mt-3 text-sm font-medium text-gray-500 duration-700 dark:text-gray-300 hover:text-gray-400 dark:hover:text-gray-200 hover:underline"
								>
									Agentic AI
								</Link>
								{/* <a
                  href="/business-ai"
                  className="block mt-3 text-sm font-medium text-gray-500 duration-700 dark:text-gray-300 hover:text-gray-400 dark:hover:text-gray-200 hover:underline"
                >
                  Bussiness Workflow Automation
                </a> */}
								<Link
									href="/create-digital-content"
									className="block mt-3 text-sm font-medium text-gray-500 duration-700 dark:text-gray-300 hover:text-gray-400 dark:hover:text-gray-200 hover:underline"
								>
									Create Digital Content
								</Link>
								<Link
									href="/tokenised-ai-agent"
									className="block mt-3 text-sm font-medium text-gray-500 duration-700 dark:text-gray-300 hover:text-gray-400 dark:hover:text-gray-200 hover:underline"
								>
									Tokenised AI Agent
								</Link>
								<Link
									href="/tokenised-digital-content"
									className="block mt-3 text-sm font-medium text-gray-500 duration-700 dark:text-gray-300 hover:text-gray-400 dark:hover:text-gray-200 hover:underline"
								>
									Tokenised Digital Content
								</Link>
							</div>
						</div>

						{/* <div>
							<div className="text-lg font-bold text-primary uppercase">
								Blogs
							</div>

							<div className="grid col-span-2 grid-cols-1 md:grid-cols-2 gap-x-10">
								{Array.from({ length: 2 }).map((_, index) => (
									<div key={index}>
										<a
											href="#"
											className="block mt-5 text-sm font-medium text-gray-500 duration-700 dark:text-gray-300 hover:text-gray-400 dark:hover:text-gray-200 hover:underline"
										>
											Installation
										</a>
										<a
											href="#"
											className="block mt-3 text-sm font-medium text-gray-500 duration-700 dark:text-gray-300 hover:text-gray-400 dark:hover:text-gray-200 hover:underline"
										>
											Release Notes
										</a>
										<a
											href="#"
											className="block mt-3 text-sm font-medium text-gray-500 duration-700 dark:text-gray-300 hover:text-gray-400 dark:hover:text-gray-200 hover:underline"
										>
											Upgrade Guide
										</a>
										<a
											href="#"
											className="block mt-3 text-sm font-medium text-gray-500 duration-700 dark:text-gray-300 hover:text-gray-400 dark:hover:text-gray-200 hover:underline"
										>
											Using with Preprocessors
										</a>
										<a
											href="#"
											className="block mt-3 text-sm font-medium text-gray-500 duration-700 dark:text-gray-300 hover:text-gray-400 dark:hover:text-gray-200 hover:underline"
										>
											Optimizing for Production
										</a>
										<a
											href="#"
											className="block mt-3 text-sm font-medium text-gray-500 duration-700 dark:text-gray-300 hover:text-gray-400 dark:hover:text-gray-200 hover:underline"
										>
											Browser Support
										</a>
										<a
											href="#"
											className="block mt-3 text-sm font-medium text-gray-500 duration-700 dark:text-gray-300 hover:text-gray-400 dark:hover:text-gray-200 hover:underline"
										>
											IntelliSense
										</a>
									</div>
								))}
							</div>
						</div> */}

						{/* <div>
							<div className="text-lg font-bold text-primary uppercase">
								Getting Started
							</div>

							<a
								href="#"
								className="block mt-5 text-sm font-medium text-gray-500 duration-700 dark:text-gray-300 hover:text-gray-400 dark:hover:text-gray-200 hover:underline"
							>
								Installation
							</a>
							<a
								href="#"
								className="block mt-3 text-sm font-medium text-gray-500 duration-700 dark:text-gray-300 hover:text-gray-400 dark:hover:text-gray-200 hover:underline"
							>
								Release Notes
							</a>
							<a
								href="#"
								className="block mt-3 text-sm font-medium text-gray-500 duration-700 dark:text-gray-300 hover:text-gray-400 dark:hover:text-gray-200 hover:underline"
							>
								Upgrade Guide
							</a>
							<a
								href="#"
								className="block mt-3 text-sm font-medium text-gray-500 duration-700 dark:text-gray-300 hover:text-gray-400 dark:hover:text-gray-200 hover:underline"
							>
								Using with Preprocessors
							</a>
							<a
								href="#"
								className="block mt-3 text-sm font-medium text-gray-500 duration-700 dark:text-gray-300 hover:text-gray-400 dark:hover:text-gray-200 hover:underline"
							>
								Optimizing for Production
							</a>
							<a
								href="#"
								className="block mt-3 text-sm font-medium text-gray-500 duration-700 dark:text-gray-300 hover:text-gray-400 dark:hover:text-gray-200 hover:underline"
							>
								Browser Support
							</a>
							<a
								href="#"
								className="block mt-3 text-sm font-medium text-gray-500 duration-700 dark:text-gray-300 hover:text-gray-400 dark:hover:text-gray-200 hover:underline"
							>
								IntelliSense
							</a>
						</div> */}
					</div>

					<Separator className="my-5" />

					<div className="sm:flex sm:items-center sm:justify-between">
						<div>
							<p className="text-sm text-gray-400">
								© Copyright 2021. All Rights Reserved.
							</p>
							<p className="text-sm text-gray-400">
								<Link href="https://maps.google.com/?q=16+Mount+Pleasant+Tunbridge+Wells+England+TN1+1QU">
									Address: 16 mount pleasent tunbridge wells England TN1 1QU
								</Link>
							</p>
						</div>

						<div className="flex mt-3 -mx-2 sm:mt-0 gap-4">
							<Link href={"mailto:info@portdex.ai"} target="_blank">
								<MailIcon className="w-5 h-5 " />
							</Link>
							<Link href={"https://x.com/Portdex"} target="_blank">
								<TwitterIcon className="w-5 h-5" />
							</Link>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
};
